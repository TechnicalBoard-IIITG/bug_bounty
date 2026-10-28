import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { INITIAL_PRODUCTS, ProductItem } from "@/lib/mockData";
import { getEffectiveStock } from "@/lib/inventoryManager";
import { isDbActiveSync, markDbOffline } from "@/lib/dbCircuitBreaker";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const isDealOnly = searchParams.get("deal") === "true";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null;
    const sort = searchParams.get("sort") || "featured";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Number(searchParams.get("limit") || 16));
    const userId = searchParams.get("userId") || null;

    let allProducts: ProductItem[] = INITIAL_PRODUCTS;

    // Fast path: Only query remote DB if circuit breaker indicates DB is reachable
    if (isDbActiveSync()) {
      try {
        const dbProducts = await prisma.product.findMany();
        if (dbProducts && dbProducts.length > 0) {
          allProducts = dbProducts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description,
            price: p.price,
            mrp: p.mrp,
            category: p.category,
            department: p.department || p.category,
            brand: p.brand,
            stock: p.stock,
            rating: p.rating,
            reviewCount: p.reviewCount,
            isPrime: p.isPrime,
            isDeal: p.isDeal,
            badge: p.badge,
            images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
            specs: typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs,
          }));
        }
      } catch {
        markDbOffline();
        allProducts = INITIAL_PRODUCTS;
      }
    }

    // Adjust effective stock per team account (only when authenticated team requests)
    let productsWithTeamStock = allProducts;
    if (userId && userId !== "guest") {
      productsWithTeamStock = await Promise.all(
        allProducts.map(async (prod) => {
          const effectiveStock = await getEffectiveStock(prod.id, userId);
          return { ...prod, stock: effectiveStock };
        })
      );
    }

    // Apply filtering
    let filtered = productsWithTeamStock.filter((p) => {
      // MED_01: Case-Sensitive Search Matching
      if (q) {
        if (isDefectActive("MED_01_CASE_SENSITIVE_SEARCH")) {
          if (!p.title.includes(q)) return false;
        } else {
          if (!p.title.toLowerCase().includes(q.toLowerCase())) return false;
        }
      }

      // Category / Department filtering (MED_02: Faceted Filter Overwrite)
      if (category && category !== "all") {
        if (p.category.toLowerCase() !== category.toLowerCase() && p.department?.toLowerCase() !== category.toLowerCase()) {
          return false;
        }
      }

      if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (isDealOnly && !p.isDeal && p.price >= p.mrp) return false;
      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;
      if (minRating !== null && p.rating < minRating) return false;

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sort === "price-asc" || sort === "price_asc") {
        // MED_03: Lexicographical String Sorting
        if (isDefectActive("MED_03_LEXICOGRAPHICAL_SORT")) {
          return String(a.price).localeCompare(String(b.price));
        }
        return a.price - b.price;
      }
      if (sort === "price-desc" || sort === "price_desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0; // featured / default
    });

    const total = filtered.length;
    let totalPages = Math.ceil(total / limit);

    // MED_04: Catalog Pagination Extra Ghost Page
    if (isDefectActive("MED_04_CATALOG_PAGINATION_EXTRA_PAGE")) {
      totalPages += 1;
    }

    const startIndex = (page - 1) * limit;
    let paginated = filtered.slice(startIndex, startIndex + limit);

    // MED_21: Infinite Scroll Duplication
    if (isDefectActive("MED_21_INFINITE_SCROLL_DUPLICATION") && page > 1 && paginated.length > 0) {
      paginated = [...paginated, paginated[0]];
    }

    return NextResponse.json({
      products: paginated,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

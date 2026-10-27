import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDefectActive } from "@/config/defects.config";
import { INITIAL_PRODUCTS, ProductItem } from "@/lib/mockData";
import { getAccountId, getAccountProductStock } from "@/lib/accountIsolation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : null;
    const sort = searchParams.get("sort") || "featured";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.max(1, Number(searchParams.get("limit") || 12));

    const accountId = getAccountId(req);
    let allProducts: ProductItem[] = [];

    // Try fetching from database first
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
          brand: p.brand,
          stock: p.stock,
          rating: p.rating,
          reviewCount: p.reviewCount,
          images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
          specs: typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs,
        }));
      } else {
        allProducts = INITIAL_PRODUCTS;
      }
    } catch {
      // Fallback to mock data if database is connecting/not seeded
      allProducts = INITIAL_PRODUCTS;
    }

    // Apply filtering
    let filtered = allProducts.filter((p) => {
      // MED_01: Case-Sensitive Search Matching
      if (q) {
        if (isDefectActive("MED_01_CASE_SENSITIVE_SEARCH")) {
          // Exact case match only
          if (!p.title.includes(q)) return false;
        } else {
          // Case-insensitive match
          if (!p.title.toLowerCase().includes(q.toLowerCase())) return false;
        }
      }

      if (category && category !== "All" && p.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) {
        return false;
      }

      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;
      if (minRating !== null && p.rating < minRating) return false;

      return true;
    });

    // Apply sorting
    if (sort === "price_asc") {
      if (isDefectActive("MED_03_LEXICOGRAPHICAL_SORT")) {
        // MED_03: Lexicographical Catalog Sort ($100 before $20)
        filtered.sort((a, b) => String(a.price).localeCompare(String(b.price)));
      } else {
        filtered.sort((a, b) => a.price - b.price);
      }
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    const total = filtered.length;

    // MED_04: Catalog Pagination Boundary
    let totalPages = Math.max(1, Math.ceil(total / limit));
    if (isDefectActive("MED_04_CATALOG_PAGINATION_EXTRA_PAGE")) {
      totalPages += 1;
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Compute account-isolated available stock for every returned product
    const paginatedWithAccountStock = await Promise.all(
      paginated.map(async (p) => ({
        ...p,
        stock: await getAccountProductStock(accountId, p.id, p.stock),
      }))
    );

    return NextResponse.json({
      products: paginatedWithAccountStock,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

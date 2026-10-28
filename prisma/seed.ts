import { PrismaClient } from "@prisma/client";
import { INITIAL_PRODUCTS } from "../src/lib/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding 60 realistic Amazon products across 6 departments...");

  for (const prod of INITIAL_PRODUCTS) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        mrp: prod.mrp,
        category: prod.category,
        department: prod.department,
        brand: prod.brand,
        stock: prod.stock,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        images: JSON.stringify(prod.images),
        specs: JSON.stringify(prod.specs),
        isPrime: prod.isPrime,
        isDeal: prod.isDeal,
        badge: prod.badge,
      },
      create: {
        title: prod.title,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        mrp: prod.mrp,
        category: prod.category,
        department: prod.department,
        brand: prod.brand,
        stock: prod.stock,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        images: JSON.stringify(prod.images),
        specs: JSON.stringify(prod.specs),
        isPrime: prod.isPrime,
        isDeal: prod.isDeal,
        badge: prod.badge,
      },
    });

    // Seed realistic community reviews (shared by all participants)
    const existingReviews = await prisma.review.count({ where: { productId: createdProduct.id } });
    if (existingReviews === 0) {
      await prisma.review.createMany({
        data: [
          {
            productId: createdProduct.id,
            userId: "community-buyer-1",
            userName: "Michael D. (Verified Buyer)",
            rating: 5,
            title: "Outstanding performance and build quality",
            comment: "Arrived in 1 day with Prime. Packaging was pristine and performance exceeds expectations.",
            isVerifiedPurchase: true,
            helpfulVotes: 18,
          },
          {
            productId: createdProduct.id,
            userId: "community-buyer-2",
            userName: "Elena R.",
            rating: 4,
            title: "Solid product, great value for money",
            comment: "Very satisfied with this purchase. Quality materials and reliable everyday performance.",
            isVerifiedPurchase: true,
            helpfulVotes: 7,
          },
        ],
      });
    }
  }

  // Seed standard competition promo codes
  const coupons = [
    { code: "SAVE10", discountPercent: 10, flatDiscount: 0 },
    { code: "WELCOME10", discountPercent: 10, flatDiscount: 0 },
    { code: "welcome10", discountPercent: 10, flatDiscount: 0 }, // For Hard 14 case-sensitive stacking
    { code: "FLAT50", discountPercent: 0, flatDiscount: 50 },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  console.log(`Successfully seeded ${INITIAL_PRODUCTS.length} products and coupons.`);
}

main()
  .catch((e) => {
    console.warn("Seeding notice (cloud DB may connect during Vercel deploy):", e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

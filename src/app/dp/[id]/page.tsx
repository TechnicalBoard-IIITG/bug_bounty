"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import { BuyBox } from "@/components/BuyBox";
import { ReviewSection } from "@/components/ReviewSection";
import { getMockReviewsForProduct } from "@/lib/mockReviews";
import { ProductItem, INITIAL_PRODUCTS } from "@/lib/mockData";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface SpecRow {
  label: string;
  value: string;
}

function getTechnicalDetails(product: ProductItem): SpecRow[] {
  const rows: SpecRow[] = [];

  rows.push({ label: "Brand", value: product.brand });
  rows.push({ label: "Manufacturer", value: `${product.brand} Corporation` });
  rows.push({ label: "Model Name", value: product.title.split(" - ")[0] || product.title });
  rows.push({ label: "Model Year", value: "2024" });

  const categoryDimensions: Record<string, { dim: string; weight: string }> = {
    Electronics: { dim: "12.95 x 9.1 x 6.38 cm", weight: "557 Grams" },
    Computers: { dim: "31.26 x 22.12 x 1.55 cm", weight: "1.61 Kilograms" },
    Fashion: { dim: "30.0 x 20.0 x 10.0 cm", weight: "420 Grams" },
    "Home & Kitchen": { dim: "34.0 x 31.0 x 37.0 cm", weight: "5.4 Kilograms" },
    Books: { dim: "19.8 x 12.9 x 2.4 cm", weight: "340 Grams" },
    "Beauty & Health": { dim: "15.0 x 6.5 x 4.0 cm", weight: "180 Grams" },
  };
  const dim = categoryDimensions[product.category] || { dim: "20.0 x 15.0 x 8.0 cm", weight: "500 Grams" };
  rows.push({ label: "Product Dimensions", value: dim.dim });
  rows.push({ label: "Item Weight", value: dim.weight });

  if (product.specs) {
    Object.entries(product.specs).forEach(([k, v]) => {
      if (k.toLowerCase() !== "brand") {
        const formattedLabel = k.replace(/([A-Z])/g, " $1").trim();
        rows.push({ label: formattedLabel, value: v });
      }
    });
  }

  const modelNo = product.id.replace("prod-", "").toUpperCase() + "-2026";
  rows.push({ label: "Item model number", value: modelNo });
  rows.push({ label: "Hardware Platform", value: `${product.category} &bull; Consumer Edition` });

  if (product.category === "Electronics" || product.category === "Computers") {
    rows.push({ label: "Connectivity Technology", value: "Wireless, Bluetooth, USB Type-C, Wi-Fi" });
    rows.push({ label: "Power Source", value: "Rechargeable Lithium-ion Battery / Corded Electric" });
  }

  const origins: Record<string, string> = {
    Sony: "Japan",
    Fujifilm: "Japan",
    Samsung: "South Korea",
    Apple: "USA",
    Bose: "USA",
    Garmin: "USA",
    Nike: "Vietnam",
    Adidas: "Germany",
    Patagonia: "USA",
  };
  rows.push({ label: "Country of Origin", value: origins[product.brand] || "United States" });

  return rows;
}

function getAdditionalDetails(product: ProductItem): SpecRow[] {
  const asinHash = ("B0" + product.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() + "890123").slice(0, 10);
  const rank = Math.floor((5.0 - product.rating) * 50) + 12;

  return [
    { label: "ASIN", value: asinHash },
    {
      label: "Customer Reviews",
      value: `${product.rating} out of 5 stars (${product.reviewCount} ratings)`,
    },
    {
      label: "Best Sellers Rank",
      value: `#${rank} in ${product.category} (See Top 100 in ${product.category})`,
    },
    { label: "Date First Available", value: "October 24, 2023" },
    { label: "Department", value: product.department || product.category },
    { label: "Manufacturer", value: `${product.brand} Direct Distribution` },
    { label: "Net Quantity", value: "1.00 Count" },
    {
      label: "Included Components",
      value: `${product.title}, Standard Accessories, Quick Start Guide, Warranty Card`,
    },
  ];
}

function getAboutThisItemBullets(product: ProductItem): { title: string; text: string }[] {
  const tailored: Record<string, { title: string; text: string }[]> = {
    "prod-e03": [
      {
        title: "40.2MP X-Trans CMOS 5 HR Sensor",
        text: "High-resolution BSI imaging sensor paired with the high-speed X-Processor 5 engine for supreme image quality, rich detail, and low-noise performance.",
      },
      {
        title: "5-Axis In-Body Image Stabilization",
        text: "Provides up to 7.0 stops of compensation, empowering sharp handheld captures in low light and silky-smooth video recording.",
      },
      {
        title: "160MP Pixel Shift Multi-Shot",
        text: "Captures 20 separate frames with sub-pixel sensor shifts to generate a staggering 160-megapixel image with zero false color artifacts.",
      },
      {
        title: "6.2K/30p & 4K/60p Internal Video",
        text: "Records in 4:2:2 10-bit color with F-Log2 support for over 13 stops of dynamic range, ideal for color grading and professional post-production.",
      },
      {
        title: "Classic Analog Dial Controls",
        text: "Tactile, lockable top-plate dials for shutter speed, ISO, and exposure compensation deliver classic photographic ergonomics and instantaneous physical control.",
      },
      {
        title: "Deep Learning AI Subject Detection",
        text: "Advanced autofocus tracking detects humans, animals, birds, automobiles, motorcycles, airplanes, and trains automatically with pinpoint accuracy.",
      },
    ],
    "prod-e01": [
      {
        title: "Industry-Leading Noise Cancellation",
        text: "Two processors and 8 microphones filter more high and mid-frequency sound than ever before, automatically optimizing to your environment.",
      },
      {
        title: "Magnificent Sound Engineered to Perfection",
        text: "Specially designed 30mm carbon-fiber composite driver unit delivers natural sound quality with deep bass and sparkling treble.",
      },
      {
        title: "Crystal-Clear Hands-Free Calling",
        text: "4 beamforming microphones, precise voice pickup technology, and advanced audio signal processing isolate your speech clearly.",
      },
      {
        title: "Up to 30-Hour Battery Life",
        text: "Long-lasting battery keeps music playing all day; a quick 3-minute charge gives up to 3 hours of playback with optional USB-PD adapter.",
      },
      {
        title: "Multipoint Bluetooth Connection",
        text: "Seamlessly pair with two devices at the same time and switch effortlessly between phone calls and laptop media.",
      },
    ],
    "prod-e02": [
      {
        title: "Quantum HDR OLED Display",
        text: "Self-illuminating pixels produce pure blacks, limitless contrast, and over a billion cinematic colors certified by Pantone.",
      },
      {
        title: "Neural Quantum Processor 4K",
        text: "20 specialized neural networks analyze content in real time to intelligently upscale scene by scene into brilliant 4K resolution.",
      },
      {
        title: "Motion Xcelerator Turbo Pro 144Hz",
        text: "Smooth gaming visuals with virtually no lag, blur, or tearing, supporting VRR, FreeSync Premium Pro, and ALLM.",
      },
      {
        title: "Dolby Atmos & Object Tracking Sound",
        text: "Top-channel speakers track the action on screen with 3D spatial audio that moves with every character and vehicle.",
      },
      {
        title: "LaserSlim Architectural Design",
        text: "Ultra-thin profile with minimalist bezels complements any modern living space whether wall-mounted or tabletop.",
      },
    ],
  };

  if (tailored[product.id]) {
    return tailored[product.id];
  }

  const sentences = product.description
    .split(/\.\s+/)
    .filter((s) => s.trim().length > 0)
    .map((s) => (s.endsWith(".") ? s : s + "."));

  const bullets: { title: string; text: string }[] = [];

  sentences.forEach((sentence) => {
    const words = sentence.split(" ");
    const titleWords = words.slice(0, Math.min(3, words.length)).join(" ").replace(/[.,]/g, "");
    bullets.push({
      title: titleWords,
      text: sentence,
    });
  });

  if (product.specs) {
    Object.entries(product.specs).forEach(([k, v]) => {
      if (bullets.length < 5) {
        bullets.push({
          title: k,
          text: `Engineered with high-grade ${k.toLowerCase()} specifications (${v}) delivering verified performance and durability.`,
        });
      }
    });
  }

  bullets.push({
    title: "Official Brand Assurance",
    text: `100% genuine ${product.brand} product backed by official manufacturer warranty and Amazon customer care.`,
  });

  return bullets;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = (params.id as string) || "";
  const currency = useCartStore((s) => s.currency);

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Variant Selection State
  const [selectedVariant, setSelectedVariant] = useState<string>("Standard");
  const [variantPriceOffset, setVariantPriceOffset] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setProduct(data);
        } else {
          const fallback = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
          if (fallback) setProduct(fallback);
        }
      })
      .catch(() => {
        const fallback = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
        if (fallback) setProduct(fallback);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-amazon-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-semibold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-amazon-text">
        <h2 className="text-xl font-bold">Product not found</h2>
        <p className="text-xs text-gray-500 mt-2">
          The requested item may have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 rounded bg-amazon-yellow px-4 py-2 text-xs font-bold"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const effectivePrice = product.price + variantPriceOffset;
  const discountPercent = calculateDiscountPercent(product.mrp, effectivePrice);

  const variants = [
    { name: "Standard (Base)", offset: 0 },
    { name: "Pro Edition (+ $50.00)", offset: 50 },
    { name: "Ultra Deluxe Edition (+ $120.00)", offset: 120 },
  ];

  const technicalDetails = getTechnicalDetails(product);
  const additionalDetails = getAdditionalDetails(product);
  const aboutBullets = getAboutThisItemBullets(product);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-amazon-text">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link
          href={`/category/${product.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
          className="hover:underline"
        >
          {product.category}
        </Link>
        <span>&rsaquo;</span>
        <span className="text-gray-800 font-medium truncate max-w-sm">
          {product.title}
        </span>
      </div>

      {/* Main 3-Column Layout: Gallery | Product Info | Buy Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery (Cols 1-5) */}
        <div className="md:col-span-5 flex gap-4">
          <div className="flex flex-col gap-2 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`h-16 w-16 rounded border p-1 overflow-hidden transition bg-white ${
                  selectedImageIndex === idx
                    ? "border-amazon-orange ring-1 ring-amazon-orange shadow"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center relative overflow-hidden group select-none">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              title={product.title}
              className="max-h-[420px] max-w-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Center Column: Core Details & Specs (Cols 6-9) */}
        <div className="md:col-span-4 space-y-4">
          <div>
            <Link
              href={`/s?brand=${encodeURIComponent(product.brand)}`}
              className="text-xs font-semibold text-amazon-link hover:underline uppercase tracking-wide"
            >
              Brand: {product.brand}
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mt-1">
              {product.title}
            </h1>
          </div>

          {/* Ratings Summary */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "text-gray-300 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-amazon-link">
              {product.rating} ratings
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">{product.reviewCount} reviews</span>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            {discountPercent > 0 && (
              <div className="text-xs font-bold text-red-700">-{discountPercent}%</div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amazon-price">
                {formatPrice(effectivePrice, currency)}
              </span>
              {product.mrp > effectivePrice && (
                <span className="text-xs text-gray-500 line-through">
                  M.R.P.: {formatPrice(product.mrp, currency)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Applicable sales tax calculated at checkout
            </p>
          </div>

          {/* Bank & Partner Offers */}
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-2">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span>💳 Bank Offers &amp; Partner Discounts</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="bg-white border border-gray-200 rounded p-2 shadow-xs">
                <span className="font-bold text-gray-800 block">Bank Instant Discount</span>
                <span className="text-gray-600 block text-[10px]">10% off up to ₹1,000</span>
                <code className="text-amazon-link font-bold mt-1 inline-block">SAVE10</code>
              </div>
              <div className="bg-white border border-gray-200 rounded p-2 shadow-xs">
                <span className="font-bold text-gray-800 block">Cashback Offer</span>
                <span className="text-gray-600 block text-[10px]">15% Cashback with card</span>
                <code className="text-amazon-link font-bold mt-1 inline-block">CASHBACK15</code>
              </div>
              <div className="bg-white border border-gray-200 rounded p-2 shadow-xs">
                <span className="font-bold text-gray-800 block">Prime Member Savings</span>
                <span className="text-gray-600 block text-[10px]">Flat ₹100 off on checkout</span>
                <code className="text-amazon-link font-bold mt-1 inline-block">PRIME100</code>
              </div>
            </div>
          </div>

          {/* Variant Selector */}
          <div className="border-t border-gray-200 pt-3">
            <span className="text-xs font-bold text-gray-800 block mb-2">
              Configuration / Edition:
            </span>
            <div className="flex flex-col gap-2">
              {variants.map((v) => (
                <button
                  key={v.name}
                  onClick={() => {
                    setSelectedVariant(v.name);
                    setVariantPriceOffset(v.offset);
                  }}
                  className={`text-left p-2.5 rounded border text-xs font-medium transition flex items-center justify-between ${
                    selectedVariant === v.name
                      ? "border-amazon-orange bg-amber-50/60 ring-1 ring-amazon-orange font-bold text-gray-900"
                      : "border-gray-300 hover:border-gray-400 bg-white text-gray-700"
                  }`}
                >
                  <span>{v.name}</span>
                  <span className="text-amazon-price">
                    {formatPrice(product.price + v.offset, currency)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Specs Overview Table (Amazon Style) */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="border-t border-gray-200 pt-4 pb-2">
              <table className="w-full text-xs">
                <tbody>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100 last:border-none">
                      <td className="py-1.5 font-bold text-gray-900 w-2/5 pr-2 align-top">{k}</td>
                      <td className="py-1.5 text-gray-800 w-3/5 align-top">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <hr className="my-3 border-gray-200" />

          {/* About This Item (Authentic Amazon Bulleted List) */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-gray-900 mb-2">
              About this item
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-gray-800 leading-relaxed">
              {aboutBullets.map((bullet, idx) => (
                <li key={idx} className="leading-snug">
                  <span className="font-bold text-gray-900">{bullet.title} &ndash; </span>
                  <span>{bullet.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Buy Box (Cols 10-12) */}
        <div className="md:col-span-3">
          <BuyBox
            product={product}
            selectedVariantPrice={effectivePrice}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUTHENTIC AMAZON PRODUCT INFORMATION & TECHNICAL DETAILS SECTION          */}
      {/* ========================================================================= */}
      <div className="mt-12 border-t border-gray-300 pt-8" id="productDetails_feature_div">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Product information</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Column 1: Technical Details Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Technical Details</h3>
            <div className="border border-gray-300 rounded overflow-hidden">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {technicalDetails.map((item, idx) => (
                    <tr
                      key={item.label}
                      className={idx % 2 === 0 ? "bg-[#f3f3f3]" : "bg-white"}
                    >
                      <th className="py-2.5 px-3 text-left font-semibold text-gray-700 w-2/5 border-b border-gray-200 align-top">
                        {item.label}
                      </th>
                      <td
                        className="py-2.5 px-3 text-gray-900 w-3/5 border-b border-gray-200 align-top"
                        dangerouslySetInnerHTML={{ __html: item.value }}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 2: Additional Information Table & Warranty */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Additional Information</h3>
            <div className="border border-gray-300 rounded overflow-hidden">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {additionalDetails.map((item, idx) => (
                    <tr
                      key={item.label}
                      className={idx % 2 === 0 ? "bg-[#f3f3f3]" : "bg-white"}
                    >
                      <th className="py-2.5 px-3 text-left font-semibold text-gray-700 w-2/5 border-b border-gray-200 align-top">
                        {item.label}
                      </th>
                      <td
                        className="py-2.5 px-3 text-gray-900 w-3/5 border-b border-gray-200 align-top"
                        dangerouslySetInnerHTML={{ __html: item.value }}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Warranty & Support Card */}
            <div className="bg-[#fcf8e3]/50 border border-[#faebcc] rounded p-4 text-xs space-y-2 mt-4">
              <h4 className="font-bold text-gray-900">Warranty &amp; Support</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong>Amazon.com Return Policy:</strong> You may return any new, unopened item within 30 days of delivery for a full refund or replacement under Amazon&apos;s Return Guarantee.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Manufacturer Warranty:</strong> 1-Year Official Hardware Warranty provided by {product.brand}. To obtain warranty service or technical assistance, contact {product.brand} authorized customer care.
              </p>
              <p className="text-gray-500 text-[11px] pt-1 border-t border-amber-200/60">
                Would you like to <strong>tell us about a lower price?</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection
        productId={product.id}
        productTitle={product.title}
        initialRating={product.rating}
        initialReviewCount={product.reviewCount}
        initialReviews={getMockReviewsForProduct(product.id, product.title)}
      />
    </div>
  );
}

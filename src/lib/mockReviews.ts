import { ReviewItem } from "@/components/ReviewSection";

interface ReviewTemplate {
  userName: string;
  rating: number;
  title: string;
  comment: string;
  helpfulVotes: number;
  daysAgo: number;
}

const TEMPLATES: ReviewTemplate[] = [
  {
    userName: "Alex R. (Verified Buyer)",
    rating: 5,
    title: "Exceptional quality and fast delivery!",
    comment: "Arrived in perfect condition within two days. Exactly as described, sturdy materials and premium tactile feel. Would highly recommend to anyone looking for genuine durability.",
    helpfulVotes: 34,
    daysAgo: 4,
  },
  {
    userName: "Sarah M.",
    rating: 4,
    title: "Solid build, great value for money",
    comment: "Performs very well day to day. A minor detail could be improved in the quick-start guide, but overall it exceeded my expectations for the price point. 4/5.",
    helpfulVotes: 19,
    daysAgo: 8,
  },
  {
    userName: "David K. (Prime Member)",
    rating: 5,
    title: "Best purchase I've made this year",
    comment: "I spent hours comparing alternatives before settling on this one. Outstanding finish, whisper-quiet operation, and seamless integration with my daily setup. 10/10.",
    helpfulVotes: 42,
    daysAgo: 12,
  },
  {
    userName: "Priya S. (Tech Enthusiast)",
    rating: 5,
    title: "Remarkable performance and premium finish",
    comment: "Packaging was pristine with official factory security seals intact. The ergonomic contours and responsive feedback make long work sessions effortless.",
    helpfulVotes: 15,
    daysAgo: 15,
  },
  {
    userName: "Marcus Vance",
    rating: 3,
    title: "Decent, but has a slight learning curve",
    comment: "It does the job well once properly configured, but the initial calibration took longer than expected. Decent everyday option if on sale.",
    helpfulVotes: 7,
    daysAgo: 21,
  },
  {
    userName: "Elena Rostova",
    rating: 5,
    title: "Exceeded all expectations!",
    comment: "Incredibly intuitive to set up right out of the box. The materials feel solid, the aesthetics match my workspace cleanly, and battery/power efficiency is top tier.",
    helpfulVotes: 28,
    daysAgo: 25,
  },
  {
    userName: "Rohan Mehta (Verified Purchaser)",
    rating: 4,
    title: "Very satisfied with the reliability",
    comment: "Been using this continuously for over three weeks now. Consistent output, zero hiccups or lag. Only knocked one star off because delivery arrived late in the evening.",
    helpfulVotes: 11,
    daysAgo: 30,
  },
  {
    userName: "Jessica Miller",
    rating: 5,
    title: "A game changer for daily productivity",
    comment: "Don't hesitate if you're on the fence! Premium craftsmanship that rivals brands costing twice as much. Packaging was eco-friendly and hassle-free to open.",
    helpfulVotes: 23,
    daysAgo: 35,
  },
  {
    userName: "Claire Bennett",
    rating: 2,
    title: "Average build, expected more premium finish",
    comment: "It works as advertised, but the outer casing feels slightly more plastic than what the promotional photos suggested. Customer service was responsive though.",
    helpfulVotes: 5,
    daysAgo: 42,
  },
  {
    userName: "Arjun Patel (Software Engineer)",
    rating: 5,
    title: "Top-tier reliability and sleek aesthetic",
    comment: "High quality components, robust thermals, and instant responsiveness. Works smoothly on both macOS and Windows without requiring third-party drivers.",
    helpfulVotes: 39,
    daysAgo: 48,
  },
  {
    userName: "Kavita Rao",
    rating: 4,
    title: "Great everyday companion",
    comment: "Good weight balance, premium texture, and very dependable. Great gift option as well since the retail box looks very sleek.",
    helpfulVotes: 9,
    daysAgo: 55,
  },
  {
    userName: "Disappointed Shopper",
    rating: 1,
    title: "Not what I expected out of the box",
    comment: "Found a cosmetic scuff on the edge right out of the box. Customer support processed a replacement smoothly, but quality control could definitely be stricter.",
    helpfulVotes: 8,
    daysAgo: 60,
  },
];

export function getMockReviewsForProduct(
  productId: string,
  productTitle: string
): ReviewItem[] {
  return TEMPLATES.map((tpl, index) => {
    const date = new Date(Date.now() - tpl.daysAgo * 86400000);
    const dateString = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return {
      id: `rev-${productId}-${index + 1}`,
      userName: tpl.userName,
      rating: tpl.rating,
      title: tpl.title,
      comment: tpl.comment.replace(
        /this product|this one/gi,
        index % 3 === 0 ? productTitle.split(" ").slice(0, 3).join(" ") : "this product"
      ),
      isVerifiedPurchase: true,
      helpfulVotes: tpl.helpfulVotes,
      createdAt: dateString,
    };
  });
}

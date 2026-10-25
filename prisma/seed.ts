import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PRODUCTS = [
  // --- Category: Electronics (10 items) ---
  {
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    slug: "sony-wh-1000xm5-wireless-headphones",
    description: "Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging. Crystal clear hands-free calling with 4 beamforming microphones.",
    price: 348.0,
    mrp: 399.99,
    category: "Electronics",
    brand: "Sony",
    stock: 45,
    rating: 4.8,
    reviewCount: 1420,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Brand: "Sony",
      "Color Options": "Black, Silver, Midnight Blue",
      Connectivity: "Bluetooth 5.2, 3.5mm AUX",
      "Battery Life": "30 Hours",
      Weight: "250g",
    }),
  },
  {
    title: "Apple MacBook Pro 14-inch M3 Chip (16GB RAM, 512GB SSD)",
    slug: "apple-macbook-pro-14-m3",
    description: "Supercharged by the M3 chip with an 8-core CPU and 10-core GPU. Striking Liquid Retina XDR display with 1000 nits sustained brightness. Up to 22 hours of battery life.",
    price: 1599.0,
    mrp: 1799.0,
    category: "Electronics",
    brand: "Apple",
    stock: 25,
    rating: 4.9,
    reviewCount: 890,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Processor: "Apple M3 Chip",
      RAM: "16GB Unified Memory",
      Storage: "512GB PCIe SSD",
      Display: "14.2-inch Liquid Retina XDR",
      Weight: "1.55 kg",
    }),
  },
  {
    title: "Samsung 55-inch OLED 4K Smart TV S90C Series",
    slug: "samsung-55-oled-4k-smart-tv",
    description: "Quantum HDR OLED delivers pure blacks and over a billion shades of colors. Neural Quantum Processor with 4K upscaling. LaserSlim design and Motion Xcelerator Turbo Pro 144Hz.",
    price: 1297.99,
    mrp: 1599.99,
    category: "Electronics",
    brand: "Samsung",
    stock: 18,
    rating: 4.7,
    reviewCount: 425,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    ]),
    specs: JSON.stringify({
      "Screen Size": "55 Inches",
      "Display Technology": "OLED 4K",
      "Refresh Rate": "144 Hz",
      "HDMI Ports": "4 (HDMI 2.1)",
    }),
  },
  {
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    slug: "logitech-mx-master-3s-mouse",
    description: "Any-surface tracking with 8K DPI sensor. Quiet Clicks technology eliminates 90% of click noise. MagSpeed electromagnetic scrolling for supreme speed and precision.",
    price: 99.99,
    mrp: 119.99,
    category: "Electronics",
    brand: "Logitech",
    stock: 80,
    rating: 4.8,
    reviewCount: 3120,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Sensor: "Darkfield 8000 DPI",
      Connectivity: "Bluetooth Low Energy & Logi Bolt",
      Battery: "Rechargeable Li-Po (500 mAh)",
      Buttons: "7 Custom Programmable Buttons",
    }),
  },
  {
    title: "Keychron Q1 Pro Wireless Custom Mechanical Keyboard",
    slug: "keychron-q1-pro-wireless-keyboard",
    description: "Full aluminum CNC machined 75% layout keyboard with hot-swappable switches, double-gasket design, and customizable RGB backlight. Connects via Bluetooth 5.1 or Type-C cable.",
    price: 199.0,
    mrp: 219.0,
    category: "Electronics",
    brand: "Keychron",
    stock: 32,
    rating: 4.6,
    reviewCount: 280,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Layout: "75% ANSI",
      Switches: "Keychron K Pro Red (Linear)",
      Body: "Full CNC Aluminum",
      Compatibility: "macOS / Windows / Linux",
    }),
  },
  {
    title: "Fujifilm X-T5 Mirrorless Digital Camera Body",
    slug: "fujifilm-x-t5-mirrorless-camera",
    description: "40.2MP X-Trans CMOS 5 HR sensor with 5-axis in-body image stabilization (IBIS). Pixel Shift Multi-Shot generates 160MP photos. 6.2K/30p 4:2:2 10-bit internal video recording.",
    price: 1699.95,
    mrp: 1799.95,
    category: "Electronics",
    brand: "Fujifilm",
    stock: 12,
    rating: 4.9,
    reviewCount: 194,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Resolution: "40.2 Megapixels",
      Mount: "Fujifilm X Mount",
      Stabilization: "Up to 7.0 Stops IBIS",
      Viewfinder: "3.69M-dot OLED EVF",
    }),
  },
  {
    title: "Anker Soundcore Motion+ Bluetooth Speaker (Hi-Res 30W)",
    slug: "anker-soundcore-motion-plus-speaker",
    description: "Hi-Res Audio certified with ultra-wide frequency range from 50 Hz to 40 kHz. Qualcomm aptX audio for lossless music streaming. IPX7 waterproof rating for outdoor use.",
    price: 99.99,
    mrp: 129.99,
    category: "Electronics",
    brand: "Anker",
    stock: 65,
    rating: 4.7,
    reviewCount: 2450,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Output: "30 Watts",
      Waterproof: "IPX7",
      Playtime: "12 Hours",
      Charging: "USB Type-C",
    }),
  },
  {
    title: "Apple iPad Air 11-inch M2 Chip (128GB, Wi-Fi 6E)",
    slug: "apple-ipad-air-11-m2",
    description: "The redesigned 11-inch iPad Air is supercharged by the Apple M2 chip. Features a Liquid Retina display, landscape 12MP front camera with Center Stage, and superfast Wi-Fi 6E.",
    price: 599.0,
    mrp: 649.0,
    category: "Electronics",
    brand: "Apple",
    stock: 40,
    rating: 4.8,
    reviewCount: 780,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Display: "11-inch Liquid Retina",
      Chip: "Apple M2 8-core CPU",
      Storage: "128GB",
      Weight: "462g",
    }),
  },
  {
    title: "Garmin Forerunner 265 GPS Running Smartwatch",
    slug: "garmin-forerunner-265-smartwatch",
    description: "Brilliant AMOLED touchscreen display with traditional button controls. Advanced running metrics including wrist-based running power and Training Readiness Score. Up to 13 days of battery life.",
    price: 449.99,
    mrp: 499.99,
    category: "Electronics",
    brand: "Garmin",
    stock: 22,
    rating: 4.7,
    reviewCount: 560,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Display: "1.3-inch AMOLED",
      Battery: "13 Days Smartwatch / 20h GPS",
      Waterproof: "5 ATM (50m)",
      GPS: "Multi-Band GNSS with SatIQ",
    }),
  },
  {
    title: "Dell UltraSharp 27-inch 4K USB-C Hub Monitor (U2723QE)",
    slug: "dell-ultrasharp-27-4k-monitor",
    description: "IPS Black technology with 2000:1 contrast ratio. Exceptional color accuracy with 98% DCI-P3 coverage. Built-in USB-C hub with 90W power delivery and RJ45 Ethernet port.",
    price: 549.99,
    mrp: 629.99,
    category: "Electronics",
    brand: "Dell",
    stock: 19,
    rating: 4.6,
    reviewCount: 380,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Resolution: "4K UHD 3840 x 2160",
      Panel: "IPS Black Technology",
      Ports: "USB-C with 90W PD, HDMI, DP, RJ45",
      Adjustability: "Height, Tilt, Swivel, Pivot",
    }),
  },

  // --- Category: Fashion (10 items) ---
  {
    // Target for Easy 5: Catalog Grid Media Mapping defect
    title: "Blue Denim Jacket",
    slug: "classic-blue-denim-jacket",
    description: "Timeless trucker-style denim jacket crafted from 100% heavyweight cotton denim. Features brass button closures, button-flap chest pockets, and adjustable waist tabs for a classic vintage fit.",
    price: 68.0,
    mrp: 89.99,
    category: "Fashion",
    brand: "Levi's",
    stock: 35,
    rating: 4.5,
    reviewCount: 520,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Material: "100% Cotton Denim",
      Fit: "Standard Classic Fit",
      Closure: "Button Front Placket",
      Care: "Machine Wash Cold Inside Out",
    }),
  },
  {
    title: "Nike Air Zoom Pegasus 40 Running Shoes",
    slug: "nike-air-zoom-pegasus-40",
    description: "Springy ride for every run. Dual Nike Air Zoom units and React foam provide lightweight, durable cushioning. Engineered mesh upper enhances breathability and comfortable lockdown.",
    price: 130.0,
    mrp: 140.0,
    category: "Fashion",
    brand: "Nike",
    stock: 55,
    rating: 4.7,
    reviewCount: 1850,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Type: "Road Running Shoes",
      Cushioning: "Nike React Foam + Zoom Air",
      Drop: "10 mm",
      Weight: "288g (Men's size 10)",
    }),
  },
  {
    title: "Patagonia Torrentshell 3L Waterproof Rain Jacket",
    slug: "patagonia-torrentshell-3l-rain-jacket",
    description: "Simple and unpretentious, our trusted Torrentshell 3L Jacket uses 3-layer H2No Performance Standard technology for exceptional waterproof/breathable performance, all-day comfort and long-lasting durability.",
    price: 179.0,
    mrp: 199.0,
    category: "Fashion",
    brand: "Patagonia",
    stock: 28,
    rating: 4.8,
    reviewCount: 710,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Waterproofing: "3-layer H2No Performance Shell",
      Fabric: "100% Recycled ECONYL Nylon",
      Hood: "Two-way adjustable with laminated visor",
      Pockets: "Two handwarmer pockets with storm flaps",
    }),
  },
  {
    title: "Ray-Ban Classic Aviator Polarized Sunglasses (RB3025)",
    slug: "ray-ban-classic-aviator-sunglasses",
    description: "Originally designed for U.S. aviators in 1937. Crystal green G-15 polarized lenses with 100% UV400 protection and gold metal wire frames.",
    price: 174.0,
    mrp: 221.0,
    category: "Fashion",
    brand: "Ray-Ban",
    stock: 42,
    rating: 4.6,
    reviewCount: 2210,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Frame: "Gold Metal",
      Lens: "Green Classic G-15 Polarized",
      Bridge: "14 mm",
      Temple: "135 mm",
    }),
  },
  {
    title: "Bellroy Slim Leather Bifold Wallet (RFID Protected)",
    slug: "bellroy-slim-sleeve-leather-wallet",
    description: "Slim profile holds 4-11 cards and folded bills without bulk. Premium environmentally certified leather with RFID blocking technology.",
    price: 79.0,
    mrp: 89.0,
    category: "Fashion",
    brand: "Bellroy",
    stock: 60,
    rating: 4.7,
    reviewCount: 940,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Material: "Top-grain Vegetable-tanned Leather",
      Capacity: "4-11 Cards + Cash",
      Features: "RFID Protection, Quick-pull Tab",
      Warranty: "3 Years",
    }),
  },
  {
    title: "Adidas Originals Stan Smith Classic Leather Sneakers",
    slug: "adidas-stan-smith-classic-sneakers",
    description: "The minimalist tennis classic with crisp white leather upper, perforated 3-stripes, and fair-green heel patch. Clean, timeless sneaker style.",
    price: 85.0,
    mrp: 100.0,
    category: "Fashion",
    brand: "Adidas",
    stock: 48,
    rating: 4.6,
    reviewCount: 3410,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Upper: "Synthetic Leather Upper with Recycled Primegreen",
      Outsole: "Rubber Cupsole",
      Closure: "Lace Closure",
    }),
  },
  {
    title: "Everlane The Organic Cotton Crew T-Shirt (3-Pack)",
    slug: "everlane-organic-cotton-crew-tshirt-3pack",
    description: "A wardrobe staple made from certified organic cotton with a comfortable regular fit. Pre-shrunk and exceptionally soft on skin.",
    price: 45.0,
    mrp: 60.0,
    category: "Fashion",
    brand: "Everlane",
    stock: 75,
    rating: 4.5,
    reviewCount: 420,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Material: "100% Certified Organic Cotton",
      Pack: "3 T-Shirts (Black, White, Heather Grey)",
      Neckline: "Ribbed Crewneck",
    }),
  },
  {
    title: "Fossil Townsman Automatic Stainless Steel Watch",
    slug: "fossil-townsman-automatic-watch",
    description: "Sophisticated skeleton dial showcases intricate automatic mechanical movement. Amber crystal lens with polished stainless steel case and brown genuine leather strap.",
    price: 195.0,
    mrp: 260.0,
    category: "Fashion",
    brand: "Fossil",
    stock: 15,
    rating: 4.4,
    reviewCount: 310,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Movement: "Automatic Mechanical (No Battery)",
      "Case Size": "44 mm",
      "Band Width": "22 mm",
      "Water Resistance": "5 ATM",
    }),
  },
  {
    title: "Lululemon Commission Slim-Fit Chino Pants (Warpstreme)",
    slug: "lululemon-commission-slim-chino",
    description: "Chino-inspired style engineered for everyday motion. Breathable Warpstreme fabric with four-way stretch, wrinkle resistance, and hidden zipper pockets.",
    price: 128.0,
    mrp: 148.0,
    category: "Fashion",
    brand: "Lululemon",
    stock: 38,
    rating: 4.8,
    reviewCount: 620,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Fabric: "Warpstreme Polyester Fabric",
      Fit: "Slim Fit (Tapered Leg)",
      Features: "Ergonomic Gusset, Hidden Zipper Pocket",
    }),
  },
  {
    title: "The North Face McMurdo Down Parka 600-Fill",
    slug: "the-north-face-mcmurdo-parka",
    description: "Ultimate cold-weather protection with 600-fill recycled waterfowl down and DryVent 2L waterproof shell. Removable faux-fur hood trim and dual alpine chest pockets.",
    price: 360.0,
    mrp: 400.0,
    category: "Fashion",
    brand: "The North Face",
    stock: 20,
    rating: 4.7,
    reviewCount: 540,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1539533018447-63fcce667883?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Insulation: "600-Fill Recycled Waterfowl Down",
      Shell: "DryVent 2-Layer Waterproof Breathable",
      Hood: "Removable Hood with Faux Fur Rake",
      Length: "Mid-thigh",
    }),
  },

  // --- Category: Home & Kitchen (10 items) ---
  {
    title: "Ninja AF101 4-Quart Digital Air Fryer",
    slug: "ninja-af101-digital-air-fryer",
    description: "Air fry with up to 75% less fat than traditional frying methods. Wide temperature range from 105°F to 400°F. Includes 4-quart nonstick basket and crisper plate that fits 2 lbs of french fries.",
    price: 89.99,
    mrp: 129.99,
    category: "Home & Kitchen",
    brand: "Ninja",
    stock: 50,
    rating: 4.8,
    reviewCount: 4210,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Capacity: "4 Quarts",
      Power: "1500 Watts",
      Functions: "Air Fry, Roast, Reheat, Dehydrate",
      "Dishwasher Safe": "Yes (Basket and crisper plate)",
    }),
  },
  {
    title: "Breville Barista Touch Espresso Machine (Stainless Steel)",
    slug: "breville-barista-touch-espresso-machine",
    description: "Barista-quality performance with intuitive touchscreen display. Built-in conical burr grinder with dose control. Automated milk texturing delivers micro-foam for latte art.",
    price: 999.95,
    mrp: 1199.95,
    category: "Home & Kitchen",
    brand: "Breville",
    stock: 14,
    rating: 4.7,
    reviewCount: 910,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Type: "Automatic Espresso Machine",
      Pressure: "15 Bar Italian Pump",
      "Water Tank": "67 fl oz (2 Liters)",
      Grinder: "Integrated Conical Burr Grinder",
    }),
  },
  {
    title: "Vitamix 5200 Professional-Grade Blender 64oz",
    slug: "vitamix-5200-blender-64oz",
    description: "The industry standard for silky-smooth smoothies, hot soups, and nut butters. Aircraft-grade stainless steel blades and variable speed control with pulse feature.",
    price: 399.95,
    mrp: 499.95,
    category: "Home & Kitchen",
    brand: "Vitamix",
    stock: 22,
    rating: 4.9,
    reviewCount: 3890,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Capacity: "64-ounce Container",
      Motor: "2.0 Peak HP",
      Blades: "Laser-cut Hardened Stainless Steel",
      Warranty: "7-Year Full Warranty",
    }),
  },
  {
    title: "iRobot Roomba j7+ Self-Emptying Robot Vacuum",
    slug: "irobot-roomba-j7-plus-robot-vacuum",
    description: "Identifies and avoids pet waste and charging cables with PrecisionVision Navigation. Automatically empties into Clean Base Automatic Dirt Disposal holding up to 60 days of debris.",
    price: 599.0,
    mrp: 799.99,
    category: "Home & Kitchen",
    brand: "iRobot",
    stock: 16,
    rating: 4.5,
    reviewCount: 1120,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Navigation: "PrecisionVision AI Obstacle Avoidance",
      "Clean Base": "Empties up to 60 days into AllergenLock bag",
      "Smart Home": "Alexa & Google Assistant Compatible",
    }),
  },
  {
    title: "All-Clad D3 10-Piece Stainless Steel Cookware Set",
    slug: "all-clad-d3-10-piece-cookware-set",
    description: "Classic 3-ply bonded construction with responsive aluminum core bonded with durable stainless steel for even heat distribution. Induction compatible and oven safe up to 600°F.",
    price: 699.99,
    mrp: 899.99,
    category: "Home & Kitchen",
    brand: "All-Clad",
    stock: 10,
    rating: 4.9,
    reviewCount: 650,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1584990347449-a2e4526df643?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Pieces: "10-Piece Set (Skillets, Sauce Pans, Sauté Pan, Stockpot)",
      Construction: "Tri-Ply Stainless Steel with Aluminum Core",
      "Oven Safe": "Up to 600°F (315°C)",
    }),
  },
  {
    title: "Fellow Stagg EKG Electric Gooseneck Kettle (0.9L)",
    slug: "fellow-stagg-ekg-electric-kettle",
    description: "For pour-over coffee connoisseurs. PID temperature controller maintains chosen temperature for up to 60 minutes. Precision pour spout prevents drips and balances water flow.",
    price: 165.0,
    mrp: 195.0,
    category: "Home & Kitchen",
    brand: "Fellow",
    stock: 35,
    rating: 4.7,
    reviewCount: 840,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Capacity: "0.9 Liters",
      Power: "1200 Watts (Quick Heating)",
      Control: "Degree-level PID Temperature Control",
      Finish: "Matte Black Stainless Steel",
    }),
  },
  {
    title: "Lodge 10.25-inch Pre-Seasoned Cast Iron Skillet",
    slug: "lodge-cast-iron-skillet-10-inch",
    description: "The essential American kitchen tool. Seasoned with 100% natural vegetable oil for an easy-release finish that improves with every use. Unmatched heat retention and even heating.",
    price: 24.9,
    mrp: 34.25,
    category: "Home & Kitchen",
    brand: "Lodge",
    stock: 120,
    rating: 4.8,
    reviewCount: 8920,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Material: "Pre-Seasoned Cast Iron",
      Diameter: "10.25 Inches",
      Handles: "Dual Assist Handles",
      Origin: "Made in South Pittsburg, Tennessee",
    }),
  },
  {
    title: "Brooklinen Luxe Sateen 4-Piece Queen Bed Sheet Set",
    slug: "brooklinen-luxe-sateen-bed-sheets-queen",
    description: "480-thread-count long-staple cotton in a luxurious sateen weave. Exceptionally silky, breathable, and buttery smooth. Includes flat sheet, fitted sheet, and 2 pillowcases.",
    price: 159.0,
    mrp: 189.0,
    category: "Home & Kitchen",
    brand: "Brooklinen",
    stock: 44,
    rating: 4.6,
    reviewCount: 1450,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Material: "100% Long-Staple Cotton",
      Weave: "Luxe Sateen (480 Thread Count)",
      Size: "Queen",
      "Pocket Depth": "Fits mattresses up to 16 inches deep",
    }),
  },
  {
    title: "KitchenAid Artisan Series 5-Quart Stand Mixer",
    slug: "kitchenaid-artisan-stand-mixer-5-quart",
    description: "Iconic tilt-head stand mixer with 10 speeds and 59-point planetary mixing action. Includes 5-quart stainless steel bowl with comfortable handle, flat beater, dough hook, and wire whip.",
    price: 379.99,
    mrp: 449.99,
    category: "Home & Kitchen",
    brand: "KitchenAid",
    stock: 20,
    rating: 4.9,
    reviewCount: 4120,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Capacity: "5 Quarts",
      Speeds: "10 Optimized Speeds",
      Attachments: "Flat Beater, Dough Hook, Wire Whip, Pouring Shield",
    }),
  },
  {
    title: "OXO Good Grips 15-Piece Everyday Kitchen Utensil Set",
    slug: "oxo-good-grips-15-piece-utensil-set",
    description: "Comprehensive kitchen tool set featuring nylon spoons, turner, silicone spatula, swivel peeler, can opener, pizza wheel, and stainless steel rotating utensil holder.",
    price: 79.99,
    mrp: 99.99,
    category: "Home & Kitchen",
    brand: "OXO",
    stock: 65,
    rating: 4.7,
    reviewCount: 1980,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Pieces: "15 Tools + Rotating Crock",
      Material: "Heat-Resistant Nylon, Silicone, Stainless Steel",
      "Dishwasher Safe": "Yes",
    }),
  },

  // --- Category: Books (10 items) ---
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    slug: "clean-code-robert-martin",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Master software engineer Robert C. Martin presents a revolutionary paradigm with best practices for writing clean, readable code.",
    price: 38.5,
    mrp: 54.99,
    category: "Books",
    brand: "Prentice Hall",
    stock: 90,
    rating: 4.8,
    reviewCount: 5120,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "Robert C. Martin",
      Pages: "464 Pages",
      Publisher: "Pearson / Prentice Hall",
      Language: "English",
      Format: "Paperback",
    }),
  },
  {
    title: "The Pragmatic Programmer: Your Journey to Mastery (20th Anniv)",
    slug: "the-pragmatic-programmer-20th-anniversary",
    description: "Written as a series of self-contained sections and filled with classic and fresh anecdotes, thoughtful examples, and interesting analogies, The Pragmatic Programmer illustrates the best practices and major pitfalls of many different aspects of software development.",
    price: 42.0,
    mrp: 59.99,
    category: "Books",
    brand: "Addison-Wesley",
    stock: 75,
    rating: 4.9,
    reviewCount: 3820,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "David Thomas, Andrew Hunt",
      Pages: "352 Pages",
      Publisher: "Addison-Wesley Professional",
      Edition: "20th Anniversary Edition (Hardcover)",
    }),
  },
  {
    title: "Designing Data-Intensive Applications: The Big Ideas",
    slug: "designing-data-intensive-applications-kleppmann",
    description: "Data is at the center of many challenges in system design today. Martin Kleppmann helps you navigate the diverse landscape of databases, stream processing, consensus algorithms, and distributed data systems.",
    price: 44.99,
    mrp: 59.99,
    category: "Books",
    brand: "O'Reilly Media",
    stock: 60,
    rating: 4.9,
    reviewCount: 4610,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "Martin Kleppmann",
      Pages: "616 Pages",
      Publisher: "O'Reilly Media",
      ISBN: "978-1449373320",
    }),
  },
  {
    title: "Project Hail Mary: A Novel by Andy Weir",
    slug: "project-hail-mary-andy-weir",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself are doomed. Except right now, he doesn't know that. A breathtaking sci-fi adventure from the author of The Martian.",
    price: 18.99,
    mrp: 28.99,
    category: "Books",
    brand: "Ballantine Books",
    stock: 85,
    rating: 4.9,
    reviewCount: 12400,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "Andy Weir",
      Pages: "496 Pages",
      Genre: "Hard Science Fiction",
      Publisher: "Ballantine Books",
    }),
  },
  {
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    slug: "atomic-habits-james-clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits and break bad ones.",
    price: 14.99,
    mrp: 27.0,
    category: "Books",
    brand: "Avery",
    stock: 140,
    rating: 4.9,
    reviewCount: 28400,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "James Clear",
      Pages: "320 Pages",
      Publisher: "Avery (Hardcover)",
      "Bestseller Rank": "#1 NYT Bestseller",
    }),
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    slug: "sapiens-brief-history-of-humankind-harari",
    description: "100,000 years ago, at least six human species inhabited the earth. Today there is just one: Homo sapiens. What happened to the others? And what may happen to us? Yuval Noah Harari explores who we are, how we got here, and where we're going.",
    price: 16.5,
    mrp: 24.99,
    category: "Books",
    brand: "Harper",
    stock: 80,
    rating: 4.7,
    reviewCount: 9200,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "Yuval Noah Harari",
      Pages: "464 Pages",
      Publisher: "Harper Perennial",
      Subject: "Anthropology / World History",
    }),
  },
  {
    title: "The Psychology of Money: Timeless lessons on wealth and greed",
    slug: "the-psychology-of-money-morgan-housel",
    description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
    price: 13.99,
    mrp: 19.99,
    category: "Books",
    brand: "Harriman House",
    stock: 95,
    rating: 4.8,
    reviewCount: 15300,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "Morgan Housel",
      Pages: "256 Pages",
      Publisher: "Harriman House",
      Genre: "Personal Finance & Economics",
    }),
  },
  {
    title: "To Kill a Mockingbird: 60th Anniversary Edition",
    slug: "to-kill-a-mockingbird-harper-lee",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Harper Lee's Pulitzer Prize-winning masterpiece of honor and injustice in the deep South.",
    price: 11.49,
    mrp: 16.99,
    category: "Books",
    brand: "Harper",
    stock: 110,
    rating: 4.8,
    reviewCount: 18900,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "Harper Lee",
      Pages: "336 Pages",
      Awards: "Pulitzer Prize Winner",
      Format: "Mass Market Paperback",
    }),
  },
  {
    title: "System Design Interview – An Insider's Guide (Volume 1)",
    slug: "system-design-interview-alex-xu",
    description: "The system design interview is considered the most difficult aspect of software engineering interviews. This book provides a step-by-step framework to approach design challenges and covers real questions asked at top tech companies.",
    price: 36.99,
    mrp: 49.99,
    category: "Books",
    brand: "Independently published",
    stock: 65,
    rating: 4.7,
    reviewCount: 3140,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "Alex Xu",
      Pages: "320 Pages",
      Topics: "Rate Limiters, Key-Value Stores, Web Crawlers, YouTube",
      Level: "Intermediate to Advanced",
    }),
  },
  {
    title: "Steve Jobs: The Exclusive Biography by Walter Isaacson",
    slug: "steve-jobs-walter-isaacson",
    description: "Based on more than forty interviews with Steve Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues—Walter Isaacson has written a riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur.",
    price: 21.0,
    mrp: 35.0,
    category: "Books",
    brand: "Simon & Schuster",
    stock: 50,
    rating: 4.7,
    reviewCount: 7600,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    ]),
    specs: JSON.stringify({
      Author: "Walter Isaacson",
      Pages: "656 Pages",
      Publisher: "Simon & Schuster",
      Format: "Hardcover",
    }),
  },
];

async function main() {
  console.log("Seeding database for Entropy 2K26 Amazon Replica...");

  // 1. Seed Users
  const hashedPasswordCustomer = await bcrypt.hash("password123", 10);
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);

  const customer = await prisma.user.upsert({
    where: { email: "customer@amazon.local" },
    update: {},
    create: {
      name: "John Customer",
      email: "customer@amazon.local",
      password: hashedPasswordCustomer,
      role: "customer",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@amazon.local" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@amazon.local",
      password: hashedPasswordAdmin,
      role: "admin",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80",
    },
  });

  console.log(`Users seeded: ${customer.email}, ${admin.email}`);

  // 2. Seed Addresses for Customer
  await prisma.address.deleteMany({ where: { userId: customer.id } });
  const addr1 = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "John Customer",
      street: "123 Amazon Way, Suite 400",
      city: "Seattle",
      state: "WA",
      pincode: "98109",
      country: "United States",
      isDefault: true,
    },
  });

  const addr2 = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "John Customer (Office)",
      street: "456 Tech Park Boulevard",
      city: "Bellevue",
      state: "WA",
      pincode: "98004",
      country: "United States",
      isDefault: false,
    },
  });

  console.log(`Addresses created: 2 for user ${customer.name}`);

  // 3. Seed Coupons
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
  console.log(`Coupons seeded: ${coupons.map((c) => c.code).join(", ")}`);

  // 4. Seed 40 Products
  for (const prod of PRODUCTS) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });

    // Add initial reviews for each product
    const existingReviews = await prisma.review.count({ where: { productId: createdProduct.id } });
    if (existingReviews === 0) {
      await prisma.review.createMany({
        data: [
          {
            productId: createdProduct.id,
            userId: customer.id,
            userName: "Alex R. (Verified Buyer)",
            rating: 5,
            title: "Exceptional quality and fast delivery!",
            comment: "Arrived in perfect condition. Exactly as described, would highly recommend to anyone looking for premium quality.",
            isVerifiedPurchase: true,
            helpfulVotes: 14,
          },
          {
            productId: createdProduct.id,
            userId: admin.id,
            userName: "Sarah M.",
            rating: 4,
            title: "Solid build, great value for money",
            comment: "Performs very well day to day. A minor detail could be improved in the documentation, but overall 4/5.",
            isVerifiedPurchase: true,
            helpfulVotes: 6,
          },
          {
            productId: createdProduct.id,
            userId: customer.id,
            userName: "Disappointed Shopper",
            rating: 1,
            title: "Not what I expected",
            comment: "Found a few issues right out of the box. Customer support was okay, but I expected more.",
            isVerifiedPurchase: true,
            helpfulVotes: 2,
          },
        ],
      });
    }
  }

  console.log(`Successfully seeded ${PRODUCTS.length} realistic products across 4 categories!`);

  // 5. Seed Initial Orders (for Hard 2 and Hard 10 testing)
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const firstProduct = await prisma.product.findFirst();
    if (firstProduct) {
      // Order 1: Delivered (Target for Hard 10: Delivered Order Cancellation defect)
      const order1 = await prisma.order.create({
        data: {
          orderNumber: "112-8492041-5928310",
          userId: customer.id,
          subtotal: firstProduct.price,
          discount: 0,
          tax: Number((firstProduct.price * 0.08).toFixed(2)),
          shippingFee: 0,
          total: Number((firstProduct.price * 1.08).toFixed(2)),
          status: "Delivered",
          items: {
            create: [
              {
                productId: firstProduct.id,
                title: firstProduct.title,
                unitPrice: firstProduct.price,
                quantity: 1,
                imageUrl: JSON.parse(firstProduct.images)[0] || "",
              },
            ],
          },
        },
      });

      // Order 2: Another user's order for Hard 2 (Order History Parameter Enumeration)
      const order2 = await prisma.order.create({
        data: {
          orderNumber: "112-9999999-0000001",
          userId: admin.id,
          subtotal: 199.0,
          discount: 20.0,
          tax: 14.32,
          shippingFee: 0,
          total: 193.32,
          status: "Processing",
          items: {
            create: [
              {
                productId: firstProduct.id,
                title: "Confidential Executive Hardware Order",
                unitPrice: 199.0,
                quantity: 1,
                imageUrl: JSON.parse(firstProduct.images)[0] || "",
              },
            ],
          },
        },
      });

      console.log(`Sample orders seeded: Delivered #${order1.orderNumber}, Processing #${order2.orderNumber}`);
    }
  }

  // 6. Seed a Password Reset Token for Hard 5 testing
  await prisma.passwordResetToken.upsert({
    where: { token: "secret-recovery-token-12345" },
    update: {},
    create: {
      email: "customer@amazon.local",
      token: "secret-recovery-token-12345",
      used: false,
    },
  });

  console.log("Password reset token seeded: 'secret-recovery-token-12345'");
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  department: string;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  specs: Record<string, string>;
  isPrime: boolean;
  isDeal: boolean;
  badge: string | null;
  createdAt?: string;
}

export const DEPARTMENTS = [
  "Electronics",
  "Computers",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Beauty & Health",
] as const;

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    "id": "prod-e01",
    "title": "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    "slug": "sony-wh-1000xm5-wireless-headphones",
    "description": "Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging. Crystal clear hands-free calling with 4 beamforming microphones.",
    "price": 348,
    "mrp": 399.99,
    "brand": "Sony",
    "stock": 45,
    "rating": 4.8,
    "reviewCount": 1420,
    "isPrime": true,
    "isDeal": true,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80"
    ],
    "specs": {
      "Brand": "Sony",
      "Connectivity": "Bluetooth 5.2",
      "Battery": "30 Hours",
      "Color": "Black"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e02",
    "title": "Samsung 55-inch OLED 4K Smart TV S90C Series",
    "slug": "samsung-55-oled-4k-smart-tv",
    "description": "Quantum HDR OLED delivers pure blacks and over a billion shades of colors. Neural Quantum Processor with 4K upscaling. LaserSlim design and Motion Xcelerator Turbo Pro 144Hz.",
    "price": 1297.99,
    "mrp": 1599.99,
    "brand": "Samsung",
    "stock": 18,
    "rating": 4.7,
    "reviewCount": 425,
    "isPrime": true,
    "isDeal": true,
    "badge": "Limited time deal",
    "images": [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80"
    ],
    "specs": {
      "Brand": "Samsung",
      "Screen": "55 Inches",
      "Resolution": "4K UHD",
      "RefreshRate": "144 Hz"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e03",
    "title": "Fujifilm X-T5 Mirrorless Digital Camera Body",
    "slug": "fujifilm-x-t5-mirrorless-camera",
    "description": "40.2MP X-Trans CMOS 5 HR sensor with 5-axis in-body image stabilization. Pixel Shift Multi-Shot generates 160MP photos. 6.2K/30p internal video recording.",
    "price": 1699.95,
    "mrp": 1799.95,
    "brand": "Fujifilm",
    "stock": 12,
    "rating": 4.9,
    "reviewCount": 194,
    "isPrime": true,
    "isDeal": false,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"
    ],
    "specs": {
      "Brand": "Fujifilm",
      "Sensor": "40.2 MP",
      "Mount": "Fujifilm X",
      "Video": "6.2K 30fps"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e04",
    "title": "Bose Smart Soundbar 900 Dolby Atmos with Alexa",
    "slug": "bose-smart-soundbar-900",
    "description": "Immersive soundbar with custom upward-firing dipole transducers. Proprietary PhaseGuide technology beams multi-directional sound. Works with Wi-Fi, Bluetooth, Apple AirPlay 2.",
    "price": 749,
    "mrp": 899,
    "brand": "Bose",
    "stock": 30,
    "rating": 4.6,
    "reviewCount": 812,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80"
    ],
    "specs": {
      "Brand": "Bose",
      "Audio": "Dolby Atmos",
      "Connectivity": "HDMI eARC, Optical, Wi-Fi",
      "Color": "Arctic White"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e05",
    "title": "Garmin Fenix 7 Pro Solar Multisport GPS Smartwatch",
    "slug": "garmin-fenix-7-pro-solar-watch",
    "description": "Solar powered multisport GPS watch with built-in LED flashlight and endurance tracking metrics. Up to 22 days of battery life in smartwatch mode with solar charging.",
    "price": 699.99,
    "mrp": 799.99,
    "brand": "Garmin",
    "stock": 22,
    "rating": 4.8,
    "reviewCount": 560,
    "isPrime": true,
    "isDeal": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
    ],
    "specs": {
      "Brand": "Garmin",
      "Display": "1.3 Inch Sunlight-visible",
      "Battery": "22 Days Solar",
      "WaterRating": "10 ATM"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e06",
    "title": "Apple iPad Air 11-inch M2 Chip (128GB, Space Gray)",
    "slug": "apple-ipad-air-11-m2",
    "description": "Breakthrough M2 performance in an impossibly thin and light design. Spectacular 11-inch Liquid Retina display with P3 wide color and antireflective coating.",
    "price": 599,
    "mrp": 649,
    "brand": "Apple",
    "stock": 35,
    "rating": 4.9,
    "reviewCount": 1120,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"
    ],
    "specs": {
      "Brand": "Apple",
      "Chip": "Apple M2",
      "Storage": "128 GB",
      "Screen": "11 Inches"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e07",
    "title": "Sonos Move 2 Portable Bluetooth & Wi-Fi Speaker",
    "slug": "sonos-move-2-portable-speaker",
    "description": "Stereo sound on the move with up to 24 hours of continuous playback. IP56 water and dust resistance. Automatically tunes itself to its surroundings via Trueplay.",
    "price": 449,
    "mrp": 499,
    "brand": "Sonos",
    "stock": 40,
    "rating": 4.7,
    "reviewCount": 390,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"
    ],
    "specs": {
      "Brand": "Sonos",
      "Battery": "24 Hours",
      "Waterproof": "IP56",
      "Connectivity": "Wi-Fi & Bluetooth"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e08",
    "title": "DJI Mini 4 Pro Drone with RC 2 Controller",
    "slug": "dji-mini-4-pro-drone",
    "description": "Under 249g ultra-lightweight drone with omnidirectional active obstacle sensing. 4K/60fps HDR true vertical shooting and up to 34 minutes of flight time.",
    "price": 759,
    "mrp": 799,
    "brand": "DJI",
    "stock": 15,
    "rating": 4.9,
    "reviewCount": 680,
    "isPrime": true,
    "isDeal": false,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80"
    ],
    "specs": {
      "Brand": "DJI",
      "Weight": "249g",
      "Video": "4K/60fps HDR",
      "FlightTime": "34 Minutes"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e09",
    "title": "Dell UltraSharp 32-inch 4K UHD USB-C Hub Monitor (U3223QE)",
    "slug": "dell-ultrasharp-32-4k-monitor",
    "description": "Brilliant color and contrast with IPS Black technology. 4K resolution with 98% DCI-P3 coverage and 90W USB-C power delivery hub.",
    "price": 719.99,
    "mrp": 919.99,
    "brand": "Dell",
    "stock": 20,
    "rating": 4.6,
    "reviewCount": 340,
    "isPrime": true,
    "isDeal": true,
    "badge": "Limited time deal",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"
    ],
    "specs": {
      "Brand": "Dell",
      "Display": "32 Inches IPS Black",
      "Resolution": "3840 x 2160",
      "Ports": "USB-C, DP, HDMI"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-e10",
    "title": "Anker Nebula Capsule 3 Laser 1080p Smart Mini Projector",
    "slug": "anker-nebula-capsule-3-laser-projector",
    "description": "Pocket-sized laser projector delivering 1080p resolution and 300 ANSI Lumens. Built-in 52Wh battery provides up to 2.5 hours of cinema playtime.",
    "price": 679.99,
    "mrp": 799.99,
    "brand": "Anker",
    "stock": 28,
    "rating": 4.5,
    "reviewCount": 512,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80"
    ],
    "specs": {
      "Brand": "Anker",
      "Brightness": "300 ANSI Lumens",
      "Resolution": "1080p FHD",
      "Playtime": "2.5 Hours"
    },
    "category": "Electronics",
    "department": "Electronics"
  },
  {
    "id": "prod-c01",
    "title": "Apple MacBook Pro 14-inch M3 Chip (16GB RAM, 512GB SSD)",
    "slug": "apple-macbook-pro-14-m3",
    "description": "Supercharged by the M3 chip with an 8-core CPU and 10-core GPU. Striking Liquid Retina XDR display with 1000 nits sustained brightness. Up to 22 hours of battery life.",
    "price": 1599,
    "mrp": 1799,
    "brand": "Apple",
    "stock": 25,
    "rating": 4.9,
    "reviewCount": 890,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
    ],
    "specs": {
      "Brand": "Apple",
      "Processor": "M3",
      "RAM": "16 GB",
      "Storage": "512 GB SSD"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c02",
    "title": "Lenovo ThinkPad X1 Carbon Gen 11 Ultrabook (Intel Core i7, 32GB RAM)",
    "slug": "lenovo-thinkpad-x1-carbon-gen-11",
    "description": "Ultra-thin carbon fiber chassis engineered for supreme enterprise productivity. 14-inch 2.8K OLED display, Dolby Atmos sound, and fingerprint biometrics.",
    "price": 1649,
    "mrp": 1899,
    "brand": "Lenovo",
    "stock": 14,
    "rating": 4.7,
    "reviewCount": 310,
    "isPrime": true,
    "isDeal": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80"
    ],
    "specs": {
      "Brand": "Lenovo",
      "Processor": "Intel Core i7-1365U",
      "RAM": "32 GB",
      "Storage": "1 TB SSD"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c03",
    "title": "Logitech MX Master 3S Wireless Performance Mouse",
    "slug": "logitech-mx-master-3s-mouse",
    "description": "Any-surface tracking with 8K DPI sensor. Quiet Clicks technology eliminates 90% of click noise. MagSpeed electromagnetic scrolling for supreme speed and precision.",
    "price": 99.99,
    "mrp": 119.99,
    "brand": "Logitech",
    "stock": 80,
    "rating": 4.8,
    "reviewCount": 3120,
    "isPrime": true,
    "isDeal": false,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80"
    ],
    "specs": {
      "Brand": "Logitech",
      "Sensor": "8000 DPI Darkfield",
      "Connectivity": "Bluetooth & Logi Bolt",
      "Battery": "70 Days"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c04",
    "title": "Keychron Q1 Pro Wireless Custom Mechanical Keyboard (Red Switches)",
    "slug": "keychron-q1-pro-wireless-keyboard",
    "description": "Full aluminum CNC machined 75% layout keyboard with hot-swappable switches, double-gasket acoustic design, and customizable RGB backlight.",
    "price": 199,
    "mrp": 219,
    "brand": "Keychron",
    "stock": 32,
    "rating": 4.6,
    "reviewCount": 280,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"
    ],
    "specs": {
      "Brand": "Keychron",
      "Layout": "75%",
      "Switches": "K Pro Red Linear",
      "Material": "Full CNC Aluminum"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c05",
    "title": "Samsung T7 Shield 2TB Portable SSD (USB 3.2 Gen 2, Rugged)",
    "slug": "samsung-t7-shield-2tb-ssd",
    "description": "Rugged durability with IP65 rating for water and dust resistance. Blazing read/write speeds up to 1050 MB/s. Dynamic Thermal Guard protects data integrity.",
    "price": 169.99,
    "mrp": 219.99,
    "brand": "Samsung",
    "stock": 60,
    "rating": 4.8,
    "reviewCount": 2450,
    "isPrime": true,
    "isDeal": true,
    "badge": "Limited time deal",
    "images": [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80"
    ],
    "specs": {
      "Brand": "Samsung",
      "Capacity": "2 TB",
      "Interface": "USB 3.2 Gen 2",
      "Speed": "1050 MB/s"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c06",
    "title": "Anker 778 Thunderbolt 4 Docking Station (12-in-1)",
    "slug": "anker-778-thunderbolt-4-dock",
    "description": "Massive 12-in-1 expansion with 40Gbps upstream Thunderbolt 4 port, 100W maximum laptop charging, 8K single display or triple 4K display support.",
    "price": 299.99,
    "mrp": 379.99,
    "brand": "Anker",
    "stock": 24,
    "rating": 4.5,
    "reviewCount": 410,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1622445262464-84b14e32452e?w=800&q=80"
    ],
    "specs": {
      "Brand": "Anker",
      "Ports": "12 Ports",
      "Charging": "100W Max",
      "Video": "8K @ 30Hz"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c07",
    "title": "Logitech Brio 4K Ultra HD Pro Webcam with HDR",
    "slug": "logitech-brio-4k-webcam",
    "description": "Spectacular 4K ultra-high definition video calling with RightLight 3 and HDR technology. Infrared facial recognition for secure Windows Hello login.",
    "price": 139.99,
    "mrp": 199.99,
    "brand": "Logitech",
    "stock": 55,
    "rating": 4.6,
    "reviewCount": 1890,
    "isPrime": true,
    "isDeal": true,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&q=80"
    ],
    "specs": {
      "Brand": "Logitech",
      "Resolution": "4K / 30fps, 1080p / 60fps",
      "FieldOfView": "65°, 78°, 90°",
      "Mic": "Dual Omni"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c08",
    "title": "ASUS ROG Rapture GT6 Gaming Mesh Wi-Fi 6 System (2-Pack)",
    "slug": "asus-rog-rapture-gt6-wifi-6",
    "description": "High-efficiency performance mesh router with tri-band Wi-Fi 6 coverage up to 5,800 sq ft. Dedicated gaming port, triple-level game acceleration, and 2.5G WAN port.",
    "price": 429.99,
    "mrp": 499.99,
    "brand": "ASUS",
    "stock": 16,
    "rating": 4.7,
    "reviewCount": 230,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
    ],
    "specs": {
      "Brand": "ASUS",
      "Coverage": "Up to 5800 sq ft",
      "Speed": "AX10000 Tri-Band",
      "Ports": "2.5G WAN, 3x Gigabit LAN"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c09",
    "title": "Rain Design mStand Aluminum Laptop Stand (Silver)",
    "slug": "rain-design-mstand-laptop-stand",
    "description": "Solid single-piece aluminum design provides rock-solid stability and acts as a heat sink to cool the laptop. Raises screen by 5.9 inches to eye level.",
    "price": 39.99,
    "mrp": 49.99,
    "brand": "Rain Design",
    "stock": 90,
    "rating": 4.8,
    "reviewCount": 8400,
    "isPrime": true,
    "isDeal": false,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"
    ],
    "specs": {
      "Brand": "Rain Design",
      "Material": "Sand-blasted Aluminum",
      "Elevation": "5.9 Inches",
      "Weight": "3 lbs"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-c10",
    "title": "CyberPower 1500VA / 1000W Pure Sine Wave UPS Battery Backup",
    "slug": "cyberpower-1500va-pure-sine-ups",
    "description": "Pure sine wave battery backup system with 12 NEMA 5-15R outlets and multifunction LCD display. Automatic Voltage Regulation safeguards sensitive workstations.",
    "price": 219.95,
    "mrp": 249.95,
    "brand": "CyberPower",
    "stock": 20,
    "rating": 4.7,
    "reviewCount": 4200,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
    ],
    "specs": {
      "Brand": "CyberPower",
      "Capacity": "1500VA / 1000W",
      "Outlets": "12 Outlets",
      "Waveform": "Sine Wave"
    },
    "category": "Computers",
    "department": "Computers"
  },
  {
    "id": "prod-f01",
    "title": "Patagonia Men's Better Sweater Fleece Jacket (Stonewash, Large)",
    "slug": "patagonia-mens-better-sweater-jacket",
    "description": "Classic full-zip fleece jacket made of 100% recycled polyester knitted fleece with dyed-with-low-impact process. Raglan sleeves for pack-wearing comfort.",
    "price": 149,
    "mrp": 169,
    "brand": "Patagonia",
    "stock": 35,
    "rating": 4.8,
    "reviewCount": 940,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"
    ],
    "specs": {
      "Brand": "Patagonia",
      "Material": "100% Recycled Polyester",
      "Fit": "Regular Fit",
      "Closure": "Full-zip"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f02",
    "title": "On Cloud 5 Men's Running Shoes (All Black, Size 10.5)",
    "slug": "on-cloud-5-mens-running-shoes",
    "description": "The fan-favorite re-engineered with 44% recycled content. Features CloudTec in Zero-Gravity foam for soft, cushioned landings and Speedboard for forward momentum.",
    "price": 139.99,
    "mrp": 149.99,
    "brand": "On",
    "stock": 48,
    "rating": 4.7,
    "reviewCount": 1620,
    "isPrime": true,
    "isDeal": false,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
    ],
    "specs": {
      "Brand": "On",
      "Cushioning": "CloudTec Zero-Gravity",
      "Lacing": "Speed Lacing System",
      "Weight": "250g"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f03",
    "title": "Seiko 5 Sports Automatic Stainless Steel Watch (SRPD55K1)",
    "slug": "seiko-5-sports-automatic-watch",
    "description": "Heritage mechanical sports timepiece with 24-jewel automatic 4R36 caliber movement. Hardlex crystal, LumiBrite hands, and 100m water resistance.",
    "price": 245,
    "mrp": 295,
    "brand": "Seiko",
    "stock": 25,
    "rating": 4.8,
    "reviewCount": 780,
    "isPrime": true,
    "isDeal": true,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80"
    ],
    "specs": {
      "Brand": "Seiko",
      "Caliber": "4R36 Automatic",
      "CaseDiameter": "42.5mm",
      "WaterResistance": "100 Meters"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f04",
    "title": "Ray-Ban Classic Polarized Aviator Sunglasses (Gold / Green)",
    "slug": "ray-ban-classic-aviator-sunglasses",
    "description": "Iconic teardrop shape with crystal polarized green lenses that block 99% of reflected light. Durable lightweight metal frame with adjustable silicone nose pads.",
    "price": 178,
    "mrp": 221,
    "brand": "Ray-Ban",
    "stock": 50,
    "rating": 4.6,
    "reviewCount": 3100,
    "isPrime": true,
    "isDeal": true,
    "badge": "Limited time deal",
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"
    ],
    "specs": {
      "Brand": "Ray-Ban",
      "LensType": "Polarized Crystal",
      "Frame": "Metal Gold",
      "UVProtection": "100% UV400"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f05",
    "title": "Bellroy Transit Urban Work Backpack 20L (Nightsky)",
    "slug": "bellroy-transit-work-backpack-20l",
    "description": "Sleek commuter backpack designed with dedicated 16-inch laptop compartment, hidden external zip pockets, contoured back panel, and water-resistant recycled fabric.",
    "price": 199,
    "mrp": 239,
    "brand": "Bellroy",
    "stock": 30,
    "rating": 4.7,
    "reviewCount": 410,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
    "specs": {
      "Brand": "Bellroy",
      "Capacity": "20 Liters",
      "LaptopSize": "Up to 16 Inches",
      "Material": "Dura-weave Recycled"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f06",
    "title": "The North Face Women's Recon Commuter Backpack (TNF Black)",
    "slug": "the-north-face-womens-recon-backpack",
    "description": "Iconic backpack updated with women-specific shoulder straps and FlexVent suspension certified by the American Chiropractic Association. Front stretch mesh pocket.",
    "price": 109,
    "mrp": 129,
    "brand": "The North Face",
    "stock": 40,
    "rating": 4.8,
    "reviewCount": 2200,
    "isPrime": true,
    "isDeal": false,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&q=80"
    ],
    "specs": {
      "Brand": "The North Face",
      "Volume": "30 Liters",
      "Fit": "Women's FlexVent",
      "Warranty": "Lifetime"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f07",
    "title": "Levi's Men's 511 Slim Fit Stretch Jeans (Clean Dark)",
    "slug": "levis-mens-511-slim-fit-jeans",
    "description": "Modern slim with room to move. Added stretch for all-day mobility. Sits below the waist with a slim leg from hip to ankle.",
    "price": 59.99,
    "mrp": 69.5,
    "brand": "Levi's",
    "stock": 75,
    "rating": 4.5,
    "reviewCount": 14200,
    "isPrime": true,
    "isDeal": false,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80"
    ],
    "specs": {
      "Brand": "Levi's",
      "Material": "99% Cotton, 1% Elastane",
      "LegOpening": "14.5 Inches",
      "Rise": "10.25 Inches"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f08",
    "title": "Fossil Men's Derrick RFID Blocking Leather Bifold Wallet (Brown)",
    "slug": "fossil-mens-derrick-leather-wallet",
    "description": "100% genuine full-grain leather wallet with built-in RFID lining that protects your credit card chips from unwarranted remote scans.",
    "price": 45,
    "mrp": 55,
    "brand": "Fossil",
    "stock": 85,
    "rating": 4.7,
    "reviewCount": 5200,
    "isPrime": true,
    "isDeal": true,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"
    ],
    "specs": {
      "Brand": "Fossil",
      "Material": "100% Genuine Leather",
      "Slots": "8 Card Slots, 2 Slip Pockets",
      "Protection": "RFID"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f09",
    "title": "Adidas Originals Stan Smith Classic Leather Sneakers (White / Green)",
    "slug": "adidas-originals-stan-smith-sneakers",
    "description": "Timeless tennis silhouette crafted from premium synthetic leather with perforated 3-Stripes and iconic green Stan Smith heel tab.",
    "price": 85,
    "mrp": 100,
    "brand": "Adidas",
    "stock": 65,
    "rating": 4.6,
    "reviewCount": 7800,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80"
    ],
    "specs": {
      "Brand": "Adidas",
      "Upper": "Synthetic Leather",
      "Outsole": "Rubber Cupsole",
      "Fit": "Standard"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-f10",
    "title": "Tommy Hilfiger Men's Classic Oxford Long Sleeve Button Down Shirt",
    "slug": "tommy-hilfiger-mens-oxford-shirt",
    "description": "Pure cotton Oxford weave shirt with button-down collar, chest pocket, and embroidered flag logo. Pre-washed for a soft broken-in feel.",
    "price": 54.5,
    "mrp": 69.5,
    "brand": "Tommy Hilfiger",
    "stock": 45,
    "rating": 4.5,
    "reviewCount": 1980,
    "isPrime": true,
    "isDeal": true,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
    ],
    "specs": {
      "Brand": "Tommy Hilfiger",
      "Fabric": "100% Breathable Cotton",
      "Collar": "Button-Down",
      "Cuff": "Adjustable Button"
    },
    "category": "Fashion",
    "department": "Fashion"
  },
  {
    "id": "prod-h01",
    "title": "Ninja AF101 4-Quart Digital Air Fryer (Crisp, Roast, Dehydrate)",
    "slug": "ninja-af101-digital-air-fryer",
    "description": "Air fry with up to 75% less fat than traditional frying methods. 4-quart ceramic-coated nonstick basket fits 2 lbs of french fries. Wide temperature range 105°F to 400°F.",
    "price": 89.99,
    "mrp": 129.99,
    "brand": "Ninja",
    "stock": 65,
    "rating": 4.8,
    "reviewCount": 42100,
    "isPrime": true,
    "isDeal": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"
    ],
    "specs": {
      "Brand": "Ninja",
      "Capacity": "4 Quarts",
      "Wattage": "1500 Watts",
      "DishwasherSafe": "Yes"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h02",
    "title": "Breville Barista Express Espresso Machine (Brushed Stainless Steel)",
    "slug": "breville-barista-express-espresso-machine",
    "description": "Create third wave specialty coffee at home using the 4 keys formula. Integrated precision conical burr grinder delivers on-demand ground coffee directly into the portafilter.",
    "price": 699.95,
    "mrp": 749.95,
    "brand": "Breville",
    "stock": 20,
    "rating": 4.8,
    "reviewCount": 16500,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80"
    ],
    "specs": {
      "Brand": "Breville",
      "Pressure": "15 Bar Italian Pump",
      "TankSize": "67 oz",
      "Grinder": "Integrated Conical Burr"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h03",
    "title": "iRobot Roomba j7+ Self-Emptying Robot Vacuum with Obstacle Avoidance",
    "slug": "irobot-roomba-j7-plus-robot-vacuum",
    "description": "Identifies and avoids pet waste and cords using PrecisionVision Navigation. Automatically empties into the Clean Base Automatic Dirt Disposal holding 60 days of debris.",
    "price": 599,
    "mrp": 799.99,
    "brand": "iRobot",
    "stock": 18,
    "rating": 4.6,
    "reviewCount": 3820,
    "isPrime": true,
    "isDeal": true,
    "badge": "Limited time deal",
    "images": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    ],
    "specs": {
      "Brand": "iRobot",
      "BinCapacity": "60 Days Enclosed",
      "Navigation": "PrecisionVision AI",
      "SmartApp": "Alexa / Google"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h04",
    "title": "Le Creuset Enameled Cast Iron Signature Round Dutch Oven (5.5 Qt, Cerise)",
    "slug": "le-creuset-enameled-round-dutch-oven",
    "description": "Indispensable French culinary classic for slow-cooking, braising, and baking bread. Superior heat distribution and retention. Colorful exterior enamel resists chipping and cracking.",
    "price": 419.95,
    "mrp": 460,
    "brand": "Le Creuset",
    "stock": 15,
    "rating": 4.9,
    "reviewCount": 4100,
    "isPrime": true,
    "isDeal": false,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1584990347449-30113c418047?w=800&q=80"
    ],
    "specs": {
      "Brand": "Le Creuset",
      "Capacity": "5.5 Quarts",
      "Material": "Enameled Cast Iron",
      "HeatSource": "Oven safe to 500°F"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h05",
    "title": "Vitamix 5200 Professional-Grade Blender (64 oz Container, Black)",
    "slug": "vitamix-5200-professional-blender",
    "description": "The professional standard for heavy-duty blending. Aircraft-grade stainless steel blades friction-heat cold ingredients into steaming hot soup in six minutes.",
    "price": 499.95,
    "mrp": 549.95,
    "brand": "Vitamix",
    "stock": 22,
    "rating": 4.8,
    "reviewCount": 9200,
    "isPrime": true,
    "isDeal": false,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80"
    ],
    "specs": {
      "Brand": "Vitamix",
      "Container": "64 Ounces Low-Profile",
      "Motor": "2.0 Peak HP",
      "Speeds": "Variable 10 Speed"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h06",
    "title": "Wüsthof Classic 8-Inch Chef's Knife (Precision Forged High Carbon)",
    "slug": "wusthof-classic-8-inch-chefs-knife",
    "description": "Forged from a single block of high-carbon stainless steel in Solingen, Germany. Precision Edge Technology (PEtec) yields a blade that is 20% sharper with twice the retention.",
    "price": 170,
    "mrp": 195,
    "brand": "Wüsthof",
    "stock": 35,
    "rating": 4.9,
    "reviewCount": 3100,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80"
    ],
    "specs": {
      "Brand": "Wüsthof",
      "BladeLength": "8 Inches",
      "Origin": "Solingen, Germany",
      "Hardness": "58 HRC"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h07",
    "title": "Cuisinart 4-Slice Custom Classic Metal Toaster (Brushed Stainless)",
    "slug": "cuisinart-4-slice-metal-toaster",
    "description": "Dual control panels let you toast two different items simultaneously. 1.5-inch wide slots accommodate artisan breads, bagels, and pastries.",
    "price": 69.95,
    "mrp": 89.95,
    "brand": "Cuisinart",
    "stock": 50,
    "rating": 4.5,
    "reviewCount": 11200,
    "isPrime": true,
    "isDeal": true,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80"
    ],
    "specs": {
      "Brand": "Cuisinart",
      "Slots": "4 Extra Wide Slots",
      "Controls": "Dual Independent Panels",
      "ShadeSettings": "6 Settings"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h08",
    "title": "All-Clad D3 Stainless Steel 10-Piece Cookware Set",
    "slug": "all-clad-d3-stainless-cookware-set",
    "description": "Classic tri-ply construction made in the USA. Alternating layers of stainless steel and responsive aluminum core deliver warp-free strength and even heating.",
    "price": 699.99,
    "mrp": 899.99,
    "brand": "All-Clad",
    "stock": 12,
    "rating": 4.8,
    "reviewCount": 2800,
    "isPrime": true,
    "isDeal": true,
    "badge": "Limited time deal",
    "images": [
      "https://images.unsplash.com/photo-1584990347449-30113c418047?w=800&q=80"
    ],
    "specs": {
      "Brand": "All-Clad",
      "Pieces": "10 Piece Set",
      "Core": "Tri-Ply Aluminum Core",
      "OvenSafe": "Up to 600°F"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h09",
    "title": "Brita Elite Grand Water Filter Pitcher (10-Cup Capacity)",
    "slug": "brita-elite-grand-water-pitcher",
    "description": "Reduces 99% of Lead, Chlorine, Mercury, and Cadmium from tap water. One Brita Elite filter lasts for 6 months or 120 gallons, replacing up to 900 single-use bottles.",
    "price": 38.99,
    "mrp": 44.99,
    "brand": "Brita",
    "stock": 80,
    "rating": 4.6,
    "reviewCount": 14500,
    "isPrime": true,
    "isDeal": false,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&q=80"
    ],
    "specs": {
      "Brand": "Brita",
      "Capacity": "10 Cups",
      "FilterType": "Brita Elite Longlast",
      "Indicator": "SmartLight LED"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-h10",
    "title": "Coop Home Goods Original Adjustable Memory Foam Pillow (Queen)",
    "slug": "coop-home-goods-adjustable-pillow",
    "description": "GREENGUARD Gold and CertiPUR-US certified. Fully adjustable shredded memory foam filling lets you add or remove fill to achieve your perfect ergonomic loft.",
    "price": 72,
    "mrp": 89,
    "brand": "Coop Home Goods",
    "stock": 70,
    "rating": 4.7,
    "reviewCount": 38900,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80"
    ],
    "specs": {
      "Brand": "Coop Home Goods",
      "Size": "Queen (20 x 30 Inches)",
      "Fill": "Oeko-Tex Shredded Foam",
      "Cover": "Lulltra Bamboo"
    },
    "category": "Home & Kitchen",
    "department": "Home & Kitchen"
  },
  {
    "id": "prod-b01",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "slug": "clean-code-robert-martin",
    "description": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Master software expert Robert C. Martin reveals battle-tested best practices.",
    "price": 42.99,
    "mrp": 54.99,
    "brand": "Pearson",
    "stock": 60,
    "rating": 4.7,
    "reviewCount": 6800,
    "isPrime": true,
    "isDeal": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&q=80"
    ],
    "specs": {
      "Author": "Robert C. Martin",
      "Format": "Paperback",
      "Pages": "464 Pages",
      "Publisher": "Prentice Hall"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b02",
    "title": "Designing Data-Intensive Applications: The Big Ideas Behind Reliable Systems",
    "slug": "designing-data-intensive-applications-kleppmann",
    "description": "Data is at the center of many challenges in system design today. Martin Kleppmann helps you navigate the diverse landscape of databases, distributed caches, and streaming frameworks.",
    "price": 46.5,
    "mrp": 59.99,
    "brand": "O'Reilly Media",
    "stock": 55,
    "rating": 4.9,
    "reviewCount": 5400,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
    ],
    "specs": {
      "Author": "Martin Kleppmann",
      "Format": "Paperback",
      "Pages": "616 Pages",
      "Publisher": "O'Reilly"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b03",
    "title": "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness",
    "slug": "the-psychology-of-money-morgan-housel",
    "description": "Doing well with money isn't necessarily about what you know. It's about how you behave. Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
    "price": 18.69,
    "mrp": 24.99,
    "brand": "Harriman House",
    "stock": 90,
    "rating": 4.8,
    "reviewCount": 48900,
    "isPrime": true,
    "isDeal": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&q=80"
    ],
    "specs": {
      "Author": "Morgan Housel",
      "Format": "Hardcover",
      "Pages": "256 Pages",
      "Publisher": "Harriman House"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b04",
    "title": "Deep Work: Rules for Focused Success in a Distracted World",
    "slug": "deep-work-cal-newport",
    "description": "Deep work is the ability to focus without distraction on a cognitively demanding task. Cal Newport blends cultural criticism and actionable advice to optimize mental concentration.",
    "price": 17.99,
    "mrp": 28,
    "brand": "Grand Central Publishing",
    "stock": 75,
    "rating": 4.6,
    "reviewCount": 19800,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80"
    ],
    "specs": {
      "Author": "Cal Newport",
      "Format": "Hardcover",
      "Pages": "304 Pages",
      "Publisher": "Grand Central"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b05",
    "title": "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    "slug": "atomic-habits-james-clear",
    "description": "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies on small changes that deliver remarkable results.",
    "price": 13.79,
    "mrp": 27,
    "brand": "Avery",
    "stock": 120,
    "rating": 4.8,
    "reviewCount": 128000,
    "isPrime": true,
    "isDeal": true,
    "badge": "#1 Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"
    ],
    "specs": {
      "Author": "James Clear",
      "Format": "Hardcover",
      "Pages": "320 Pages",
      "Publisher": "Avery"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b06",
    "title": "Dune (The Dune Chronicles, Book 1) Deluxe Edition",
    "slug": "dune-deluxe-edition-frank-herbert",
    "description": "Frank Herbert's masterwork - the epic tale of Paul Atreides and the desert planet Arrakis. A landmark triumph of world-building and winner of the Hugo and Nebula Awards.",
    "price": 24.99,
    "mrp": 35,
    "brand": "Ace Books",
    "stock": 45,
    "rating": 4.8,
    "reviewCount": 22400,
    "isPrime": true,
    "isDeal": false,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=800&q=80"
    ],
    "specs": {
      "Author": "Frank Herbert",
      "Format": "Deluxe Hardcover",
      "Pages": "688 Pages",
      "Publisher": "Ace"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b07",
    "title": "Project Hail Mary: A Novel by Andy Weir",
    "slug": "project-hail-mary-andy-weir",
    "description": "Ryland Grace is the sole survivor on a desperate last-chance interstellar mission to save humanity from extinction. A triumphant celebration of science, intellect, and friendship.",
    "price": 15.99,
    "mrp": 28.99,
    "brand": "Ballantine Books",
    "stock": 55,
    "rating": 4.9,
    "reviewCount": 64000,
    "isPrime": true,
    "isDeal": true,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80"
    ],
    "specs": {
      "Author": "Andy Weir",
      "Format": "Hardcover",
      "Pages": "496 Pages",
      "Publisher": "Ballantine"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b08",
    "title": "Thinking, Fast and Slow by Daniel Kahneman",
    "slug": "thinking-fast-and-slow-kahneman",
    "description": "Nobel Memorial Prize winner Daniel Kahneman takes us on a groundbreaking tour of the mind, explaining the two cognitive systems that drive the way we think and decide.",
    "price": 14.29,
    "mrp": 20,
    "brand": "Farrar, Straus and Giroux",
    "stock": 65,
    "rating": 4.6,
    "reviewCount": 38200,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&q=80"
    ],
    "specs": {
      "Author": "Daniel Kahneman",
      "Format": "Paperback",
      "Pages": "512 Pages",
      "Publisher": "FSG"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b09",
    "title": "The Pragmatic Programmer: Your Journey To Mastery (20th Anniversary Edition)",
    "slug": "the-pragmatic-programmer-thomas-hunt",
    "description": "One of the most significant books in modern software engineering. Illustrates best practices and major pitfalls across code architecture, career mastery, and test-driven development.",
    "price": 49.99,
    "mrp": 59.99,
    "brand": "Addison-Wesley",
    "stock": 35,
    "rating": 4.8,
    "reviewCount": 4200,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"
    ],
    "specs": {
      "Author": "David Thomas, Andrew Hunt",
      "Format": "Hardcover",
      "Pages": "352 Pages",
      "Publisher": "Addison-Wesley"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-b10",
    "title": "Salt, Fat, Acid, Heat: Mastering the Elements of Good Cooking",
    "slug": "salt-fat-acid-heat-samin-nosrat",
    "description": "Visionary cookbook by chef Samin Nosrat. Master the four simple elements of cooking to instinctively elevate any dish without needing step-by-step recipes.",
    "price": 23.49,
    "mrp": 37.5,
    "brand": "Simon & Schuster",
    "stock": 50,
    "rating": 4.9,
    "reviewCount": 29800,
    "isPrime": true,
    "isDeal": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80"
    ],
    "specs": {
      "Author": "Samin Nosrat",
      "Format": "Hardcover",
      "Pages": "480 Pages",
      "Publisher": "Simon & Schuster"
    },
    "category": "Books",
    "department": "Books"
  },
  {
    "id": "prod-p01",
    "title": "Philips Sonicare DiamondClean Smart 9500 Electric Toothbrush (White)",
    "slug": "philips-sonicare-diamondclean-9500",
    "description": "Complete oral care system with smart sensors and real-time personalized feedback via mobile app. Up to 10x more plaque removal and 7x healthier gums in 2 weeks.",
    "price": 219.96,
    "mrp": 279.96,
    "brand": "Philips",
    "stock": 40,
    "rating": 4.7,
    "reviewCount": 7800,
    "isPrime": true,
    "isDeal": true,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1559591937-e620583a45c7?w=800&q=80"
    ],
    "specs": {
      "Brand": "Philips Sonicare",
      "Modes": "5 Cleaning Modes",
      "Speeds": "3 Intensities",
      "Charging": "Glass Cup + Travel Case"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p02",
    "title": "Dyson Supersonic Hair Dryer (Iron / Fuchsia)",
    "slug": "dyson-supersonic-hair-dryer",
    "description": "Engineered for different hair types. Intelligent heat control measures air temperature 40 times per second to prevent extreme heat damage and protect natural shine.",
    "price": 429.99,
    "mrp": 449.99,
    "brand": "Dyson",
    "stock": 18,
    "rating": 4.7,
    "reviewCount": 4200,
    "isPrime": true,
    "isDeal": false,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
    ],
    "specs": {
      "Brand": "Dyson",
      "Power": "1600 Watts",
      "Motor": "Dyson Digital V9",
      "Attachments": "5 Styling Attachments"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p03",
    "title": "CeraVe Moisturizing Cream with Hyaluronic Acid and 3 Essential Ceramides",
    "slug": "cerave-moisturizing-cream-19oz",
    "description": "Developed with dermatologists. 24-hour hydration barrier restoration with MVE Delivery Technology. Rich, velvety, non-greasy, and fragrance-free.",
    "price": 17.78,
    "mrp": 19.99,
    "brand": "CeraVe",
    "stock": 120,
    "rating": 4.8,
    "reviewCount": 94000,
    "isPrime": true,
    "isDeal": false,
    "badge": "#1 Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "specs": {
      "Brand": "CeraVe",
      "Size": "19 Ounces",
      "SkinType": "Dry to Very Dry",
      "Formula": "Non-comedogenic, Fragrance-Free"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p04",
    "title": "Braun Series 9 PRO+ Electric Shaver with 6-in-1 SmartCare Center",
    "slug": "braun-series-9-pro-plus-shaver",
    "description": "Braun's most advanced electric razor. 5 synchronized shaving elements capture more hairs in one stroke. Sonic Technology glides gently over skin.",
    "price": 329.94,
    "mrp": 379.99,
    "brand": "Braun",
    "stock": 22,
    "rating": 4.6,
    "reviewCount": 3100,
    "isPrime": true,
    "isDeal": true,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80"
    ],
    "specs": {
      "Brand": "Braun",
      "Trimmer": "ProLift Trimmer",
      "Battery": "60 Mins Li-Ion",
      "Waterproof": "100% Waterproof"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p05",
    "title": "SkinCeuticals C E Ferulic Combination Antioxidant Treatment (1 fl oz)",
    "slug": "skinceuticals-c-e-ferulic-antioxidant",
    "description": "Gold-standard daytime vitamin C serum delivering advanced environmental protection and visible anti-aging benefits. Neutralizes free radicals caused by UVA/UVB.",
    "price": 182,
    "mrp": 185,
    "brand": "SkinCeuticals",
    "stock": 30,
    "rating": 4.8,
    "reviewCount": 2890,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
    ],
    "specs": {
      "Brand": "SkinCeuticals",
      "Volume": "1 Fl Oz / 30ml",
      "Active": "15% L-Ascorbic Acid, 1% Alpha Tocopherol",
      "Type": "Serum"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p06",
    "title": "Asakuki 500ml Premium Essential Oil Diffuser with 7 LED Ambient Colors",
    "slug": "asakuki-500ml-essential-oil-diffuser",
    "description": "5-in-1 ultrasonic aromatherapy device. Features a 500ml easy-to-clean water tank, 7 distinct LED light colors, multiple mist nebulizer modes, and safety auto-switch.",
    "price": 25.99,
    "mrp": 35.99,
    "brand": "Asakuki",
    "stock": 85,
    "rating": 4.5,
    "reviewCount": 41200,
    "isPrime": true,
    "isDeal": true,
    "badge": "Best Seller",
    "images": [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80"
    ],
    "specs": {
      "Brand": "Asakuki",
      "TankCapacity": "500 ml",
      "RunTime": "Up to 16 Hours",
      "BPAFree": "Yes"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p07",
    "title": "La Roche-Posay Anthelios Melt-in Milk Sunscreen SPF 60 (5 fl oz)",
    "slug": "la-roche-posay-anthelios-spf-60",
    "description": "Multi-award winning broad-spectrum face and body sunscreen. Fast-absorbing, velvety texture formulated with Cell-Ox Shield antioxidant technology. Water resistant 80 mins.",
    "price": 37.99,
    "mrp": 39.99,
    "brand": "La Roche-Posay",
    "stock": 65,
    "rating": 4.8,
    "reviewCount": 18400,
    "isPrime": true,
    "isDeal": false,
    "badge": "Amazon's Choice",
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80"
    ],
    "specs": {
      "Brand": "La Roche-Posay",
      "SPF": "60 Broad Spectrum",
      "Volume": "5 Fl Oz",
      "WaterResistant": "80 Minutes"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p08",
    "title": "Kiehl's Creamy Eye Treatment with Avocado (0.95 oz)",
    "slug": "kiehls-creamy-eye-treatment-avocado",
    "description": "Rich and creamy eye cream with avocado oil gently moisturizes the delicate under-eye area. Ophthalmologist- and dermatologist-tested for all skin types.",
    "price": 60,
    "mrp": 65,
    "brand": "Kiehl's",
    "stock": 45,
    "rating": 4.6,
    "reviewCount": 3900,
    "isPrime": true,
    "isDeal": false,
    "badge": null,
    "images": [
      "https://images.unsplash.com/photo-1512290900672-1f0236a0c5b3?w=800&q=80"
    ],
    "specs": {
      "Brand": "Kiehl's",
      "Size": "0.95 Oz / 28g",
      "KeyIngredient": "Avocado Oil, Beta-Carotene",
      "Texture": "Rich Cream"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p09",
    "title": "Bleu de Chanel Eau de Parfum Spray for Men (3.4 oz)",
    "slug": "bleu-de-chanel-eau-de-parfum",
    "description": "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail. Notes of citrus, ambery cedar, and tonka bean.",
    "price": 155,
    "mrp": 175,
    "brand": "Chanel",
    "stock": 25,
    "rating": 4.9,
    "reviewCount": 5100,
    "isPrime": true,
    "isDeal": false,
    "badge": "Overall Pick",
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"
    ],
    "specs": {
      "Brand": "Chanel",
      "Concentration": "Eau de Parfum",
      "Volume": "3.4 Fl Oz / 100ml",
      "Scent": "Woody Aromatic"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  },
  {
    "id": "prod-p10",
    "title": "TheraGun PRO Plus Handheld Deep Tissue Percussive Massage Gun",
    "slug": "theragun-pro-plus-massage-gun",
    "description": "Ultimate recovery device combines proven 16mm percussive massage therapy with near-infrared LED light therapy, vibration, and heated massage attachments.",
    "price": 599,
    "mrp": 649,
    "brand": "TheraBody",
    "stock": 14,
    "rating": 4.8,
    "reviewCount": 1400,
    "isPrime": true,
    "isDeal": true,
    "badge": "Limited time deal",
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
    ],
    "specs": {
      "Brand": "TheraBody",
      "Amplitude": "16mm",
      "Attachments": "6 Attachments",
      "Motor": "QuietForce Technology"
    },
    "category": "Beauty & Health",
    "department": "Beauty & Health"
  }
];

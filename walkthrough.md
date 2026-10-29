# Walkthrough: Full-Stack Amazon Replica for QA Bug Bounty Simulation

The full-stack Amazon e-commerce replica for the **Entropy 2K26 QA Bug Bounty Simulation** has been rebuilt, visually elevated to authentic Amazon design standards, and verified in:
`C:\Users\LENOVO\Documents\Extra Co-Curry\Bug_bounty\Amazon_replica`

---

## 🌟 What Was Built & Rebuilt

### 1. Technology Stack & Database
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS with Amazon authentic design tokens (`#131921` dark navy header, `#232f3e` subnav, `#febd69` / `#f3a847` search amber, `#ffd814` yellow buttons, `#eaeded` light background, `#131a22` sub-footer).
- **Database**: PostgreSQL with Prisma ORM (`DATABASE_URL`, `DIRECT_URL`) + resilient in-memory fallback stores (`orderStore.ts`, `inventoryManager.ts`) for offline or firewall-isolated environments.
- **State Management**: Zustand with persistent client storage and hydration guards.
- **Zero Client-Side Defect Identification (Anti-AI Source Scrubbing)**:
  - All client components (`"use client"`) consume neutral boolean flags from `src/lib/uiDefects.ts` instead of `defects.config.ts`.
  - Compiled JavaScript chunks in `_next/static/` contain **zero defect identifiers** (`EASY_`, `MED_`, `HARD_`, `FLAG{`).
  - Participants cannot extract answers by inspecting JavaScript bundles in browser DevTools.
- **Expanded Catalog**: ~60 realistic products across 6 departments with high-resolution Unsplash imagery and full technical specifications.

### 2. Complete Storefront Scope & Routes

| Route | Feature Area | Key Functionality & Flaws Handled |
|:---|:---|:---|
| `/` | **Homepage** | Hero banner carousel with elevated 520px layout, working backward slide navigation (Easy 4 forward right-arrow lock defect), 4-card category promo grid, today's deals rail, and 6 department recommendation rails. Default currency set to Indian Rupee (INR - ₹) with dynamic regional pricing and flag selector. |
| `/s` | **Search & Catalog** | Multi-department search, faceted filtering (categories, brands, ratings, price ranges), sorting (`price-asc`, `price-desc`, `rating`, `featured`), pagination (Med 4, Easy 17), and infinite scroll duplication (Med 21). |
| `/category/:slug` | **Department Landing** | Full-fledged department catalogs for **Electronics, Computers, Fashion, Home & Kitchen, Books, and Beauty & Health** with Amazon breadcrumbs, subcategory tag pills, left sidebar filters, and sorting. |
| `/deals` | **Today's Lightning Deals** | Dedicated daily deals showcase with countdown timers, department filter pills, and discount tier buttons (10%+, 15%+, 20%+ off). |
| `/dp/:id` | **Product Detail Page** | Vertical thumbnail gallery, hover zoom, specs table, Buy Box (Easy 6, Med 20, Hard 16), and customer review section (Easy 16, Hard 7). |
| `/cart` | **Shopping Cart** | Itemized table, subtotal math, line item display (Med 8), coupon compounding (Med 7), case-sensitive promo stacking (Hard 14), and mobile button overflow (Easy 7). |
| `/checkout` | **Checkout Flow** | Multi-step accordion: Address with browser autofill binding (Med 9), Country select (Easy 8), ZIP whitespace bypass (Med 19), Card formatting (Med 12), CVV tooltip (Easy 9), **Merged Tax Math (Med 10 + Hard 15)**, and debouncing (Med 13). |
| `/orders` & `/orders/:id/summary` | **Orders & Receipts** | Team-scoped order history with status badges, receipt viewer (Hard 2 enumeration), and order cancellation (Hard 10 delivered order cancellation). |
| `/account`, `/account/addresses`, `/account/profile` | **Account Hub** | Saved addresses manager (Med 14 delete offset), Profile settings with Base64 avatar upload (Med 15 unrestricted MIME) and role escalation (Hard 13). |
| `/admin/users` | **Decommissioned Portal** | Completely removed per requirements; returns **HTTP 404 Not Found**. (HARD-03 retired). |
| `/login` & `/register` | **Authentication** | Sign-in with password mask eye toggle (Easy 10), open redirect (Hard 6), checkout redirect clear (Med 17), and registration password mismatch bypass (Med 16). |
| `/forgot-password` & `/reset-password` | **Password Assistance** | Recovery token generation and password reset (Hard 5 reusable token flaw). |
| `/contact` & `/faq` | **Support & Help** | Contact form with email validation bypass (Easy 11) and FAQ accordion with close failure (Easy 12). |
| `/about` & `/not-found` | **Auxiliary & 404** | Static about page (Easy 1 logo target) and authentic Amazon 404 error page (Easy 13). |

---

## 🧪 Seeded Defects Verification

The simulation features **54 actively seeded master defects** (18 Easy, 21 Medium, 15 Hard):

1. **Easy Defects (EASY-01 to EASY-18)**: 18 active bugs (3 Base pts + 2 Speed Bonus pts).
2. **Medium Defects (MED-01 to MED-21)**: 21 active bugs (5 Base pts + 5 Speed Bonus pts).
3. **Hard Defects (HARD-01 to HARD-16, HARD-03 Retired)**: 15 active bugs (10 Base pts + 10 Speed Bonus pts).
4. **Treasure Bugs**: Dormant / withheld per staging instructions.

---

## 👥 Team Accounts, Multi-Device Isolation & Shared Reviews

To guarantee absolute fairness across all competing teams in the Entropy 2K26 Bug Bounty:

1. **Dedicated Account per Team:**
   - Each participating team registers their own dedicated account at `/register` using their team credentials.
   - **No Two Teams Share An Account:** Competing teams operate under independent credentials.
   - All 3 team members log into this single team account across their 3 laptops.

2. **Per-Team Isolated Inventory:**
   - Purchasing an item decrements inventory **only for the purchasing team's account** (`inventoryManager.ts`).
   - Competing teams always see full baseline stock, preventing inventory starvation attacks.

3. **Order & Address Privacy:**
   - Orders placed by a team are tied strictly to their `userId`.
   - Competing teams cannot view each other's orders in `/orders`.

4. **Shared Community Feedback:**
   - Customer product reviews and comments submitted at `/api/reviews` are shared across all teams to foster an authentic live marketplace feel and allow community testing of `HARD-07` (Stored XSS).

5. **Remote Storefront Reset:**
   - The Judge Console in the Submission Portal (port 3001) includes a **"RESET STOREFRONT"** button that sends a POST request to `/api/admin/reset`, restoring baseline inventory and clearing test orders on demand.

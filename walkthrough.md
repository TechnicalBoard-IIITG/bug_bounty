# Walkthrough: Full-Stack Amazon Replica for QA Bug Bounty Simulation

The full-stack Amazon e-commerce replica for the **Entropy 2K26 QA Bug Bounty Simulation** has been created, verified, and committed to git in:
`C:\Users\LENOVO\Documents\Extra Co-Curry\Bug_bounty\Amazon_replica`

---

## 🌟 What Was Built

### 1. Technology Stack & Database
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS with official Amazon design system (`#131921`, `#232f3e`, `#febd69`, `#ffa41c`, `#ffd814`, `#eaeded`)
- **Database**: PostgreSQL with Prisma ORM configured with `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) for Vercel Serverless persistence.
- **State Management**: Zustand with persistent client storage and hydration guards.
- **Resilience**: Integrated in-memory mock catalog containing all 40+ products across 4 categories so the storefront functions immediately even before a live cloud database is connected.

### 2. Complete Storefront Scope & Routes
| Route | Feature Area | Key Functionality & Flaws Handled |
|:---|:---|:---|
| `/` | **Homepage** | Hero banner carousel with working slide indicators (Easy 4 right arrow defect), 4-card category grid, and 4 recommendation rails. |
| `/s` | **Search & Catalog** | Faceted filtering by category, brand, review stars, price range; sorting (Med 3); pagination (Med 4, Easy 17); infinite scroll duplication (Med 21). |
| `/category/:slug` | **Department Landing** | Dedicated departmental catalogs for Electronics, Fashion, Home & Kitchen, and Books. |
| `/dp/:id` | **Product Detail Page** | Vertical thumbnail gallery, hover zoom, specs table, Buy Box (Easy 6, Med 20, Hard 16), Review section (Easy 16, Hard 7), and **TB-1 7-click Easter egg**. |
| `/cart` | **Shopping Cart** | Itemized table, subtotal math, line item display (Med 8), coupon compounding (Med 7), case-sensitive promo stacking (Hard 14), mobile button overflow (Easy 7). |
| `/checkout` | **Checkout Flow** | Multi-step accordion: Address with browser autofill binding (Med 9), Country select (Easy 8), ZIP whitespace bypass (Med 19), Card formatting (Med 12), CVV tooltip (Easy 9), **Merged Tax Math (Med 10 + Hard 15)**, and debouncing (Med 13). |
| `/orders` & `/orders/:id/summary` | **Orders & Receipts** | Order history with status badges, receipt viewer (Hard 2 enumeration), and order cancellation (Hard 10 delivered order cancellation). |
| `/account`, `/account/addresses`, `/account/profile` | **Account Hub** | Saved addresses manager (Med 14 delete offset), Profile settings with Base64 avatar upload (Med 15 unrestricted MIME) and role escalation (Hard 13). |
| `/admin/users` | **Admin Console** | Back-office user console (Hard 3 unrestricted access) . |
| `/login` & `/register` | **Authentication** | Sign-in with password mask eye toggle (Easy 10), open redirect (Hard 6), checkout redirect clear (Med 17), and registration password mismatch bypass (Med 16). |
| `/forgot-password` & `/reset-password` | **Password Assistance** | Recovery token generation and password reset (Hard 5 reusable token flaw). |
| `/contact` & `/faq` | **Support & Help** | Contact form with email validation bypass (Easy 11) and FAQ accordion with close failure (Easy 12). |
| `/about` & `/not-found` | **Auxiliary & 404** | Static about page (Easy 1 logo target) and authentic "Dogs of Amazon" 404 error page (Easy 13). |

---

## 🧪 Seeded Defects Verification

All 55 regular bugs + 2 treasure bugs are active by default in `src/config/defects.config.ts`.

### 5 User-Requested Specifications Tested & Verified:
1. **PostgreSQL Configuration**: `prisma/schema.prisma` uses `provider = "postgresql"` with `DATABASE_URL` and `DIRECT_URL`.
2. **Hard 11 Cart API**: `src/app/api/cart/route.ts` accepts negative integer quantities (e.g. `quantity: -5`) to reduce the cart subtotal balance.
3. **Easy 10 Password Mask Toggle**: Password field in `src/app/login/page.tsx` renders plain visible text by default and **only masks** when clicking the eye icon (no onFocus masking).
4. **Treasure Bugs Formatting (Rule 3.3)**:
   - **TB #1 (Console Leak)**: Clicking product image 7 times outputs:  
     `TREASURE_BUG_#1: RkxBR3s3X2NsaWNrc191bmxvY2tlZF9zZWNyZXRfdHJlYXN1cmV9`
   - **TB #3 (DOM Source Inspection)**: Inspecting DOM HTML comments reveals:  
     `TREASURE_BUG_#3: FLAG{inspect_element_dom_source_revealed}`
5. **Merged Tax Logic (Medium 10 & Hard 15)**: In `src/app/checkout/page.tsx`, `taxableBase` evaluates to pre-discount subtotal when Med 10 is active, and `Math.floor(taxableBase)` truncates taxable cents before computing 8% tax when Hard 15 is active.

---

## 🛠️ Verification & Build Results
- `npm run build` executed and passed with **exit code 0**.
- Zero TypeScript errors across all 69 files.
- All dynamic and static routes compiled and optimized.
- Git repository initialized and initial commit created: `c6fa0c6`.


---

## 👥 Team Accounts, Multi-Device Isolation & Shared Reviews

To guarantee fairness across all competing teams in the Entropy 2K26 Bug Bounty:

1. **Dedicated Account per Team:**
   - Each participating team must register their own dedicated account at `/register` (e.g. using their official team name or registered team email).
   - **No Two Teams Should Share An Account:** Competing teams must not use the same credentials.
   - **All 3 Team Members** sign into this single team account on their 3 respective laptops.

2. **Order & Address Privacy:**
   - Orders placed by a team are tied strictly to their `userId`.
   - Competing teams cannot view or alter each other's orders in `/orders`.
   - Unauthenticated sessions on `/orders` only see the baseline sample order (`#112-8492041-5928310`) for defect testing without exposing other teams' data.

3. **Global Non-Depleting Inventory:**
   - Catalog inventory does not decrease globally in the database when orders are placed.
   - Every team always sees full baseline product stock, preventing any team from starving product inventory for others.

4. **Shared Community Feedback:**
   - Customer product reviews and comments submitted at `/api/reviews` are shared across all teams to foster an authentic live marketplace feel and allow community testing of `HARD-07` (Stored XSS).

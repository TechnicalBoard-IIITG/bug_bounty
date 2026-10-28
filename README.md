# Amazon Replica — QA Bug Bounty Simulation (Entropy 2K26)

A production-grade, full-stack Amazon e-commerce replica purpose-built for the **Entropy 2K26 QA Bug Bounty Simulation**. The project features an authentic Amazon design system, PostgreSQL database managed via Prisma ORM, rich catalog with 40+ products, full end-to-end shopping workflow, and **55 precisely seeded defects** (18 Easy, 21 Medium, 16 Hard) plus **2 Treasure Bug flag challenges** centrally controlled via `src/config/defects.config.ts`.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **npm**: v9 or higher
- **PostgreSQL Database**: Free cloud instance from [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com), or a local PostgreSQL server.

### 2. Local Setup
```bash
# 1. Install all dependencies
npm install

# 2. Configure environment variables
# Copy .env.example to .env and insert your PostgreSQL connection strings:
cp .env.example .env
```

Ensure your `.env` contains:
```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
DIRECT_URL="postgresql://user:password@host/db?sslmode=require"
JWT_SECRET="entropy_2k26_amazon_replica_super_secret_jwt_key_2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

```bash
# 3. Setup and seed the database
npm run db:setup

# 4. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

This project is fully engineered for Vercel Serverless Hosting with zero file write crashes or binary mismatches:
1. Push this repository to GitHub (see instructions below).
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. In the **Environment Variables** section, add:
   - `DATABASE_URL`: Your pooled PostgreSQL connection string (e.g. from Neon.tech).
   - `DIRECT_URL`: Your direct connection string.
   - `JWT_SECRET`: Any random 32-character string.
4. Click **Deploy**. Vercel will automatically run `prisma generate && next build` and deploy your app.

---

## 📦 How to Push to GitHub

To push this codebase to your own GitHub account:

```bash
# 1. Stage all files
git add .

# 2. Create initial commit
git commit -m "Initial commit: Full-stack Amazon replica with seeded bug bounty defects"

# 3. Set default branch to main
git branch -M main

# 4. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 5. Push to GitHub
git push -u origin main
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Privileges |
|:---|:---|:---|:---|
| **Customer** | `customer@amazon.local` | `password123` | Standard shopper, order history, saved addresses |
| **Admin** | `admin@amazon.local` | `admin123` | Back-office user console, system metrics |

---

## 🐞 Seeded Bugs & Defect Directory

All defects are centrally configured in `src/config/defects.config.ts`. Every defect defaults to `true` and is engineered to fail logically without crashing React or triggering white-screen exceptions.

### Part I: Easy Defects (1–18) [3 Base pts | +2 Speed Bonus | Max 5 pts]
- **Easy 1: Top Navbar Logo Routing** (`Header.tsx`): Clicking the brand logo routes to `/about` instead of `/`.
- **Easy 2: Theme Toggle Visual Inconsistency** (`Header.tsx`): Header theme switcher toggles icon state without changing background or CSS variables.
- **Easy 3: Reactive Cart Badge Counter** (`Header.tsx`): Header badge counter remains at 0 and does not update dynamically until browser reload.
- **Easy 4: Hero Carousel Directional Control** (`HeroCarousel.tsx`): Right navigation arrow triggers no action, while left arrow functions normally.
- **Easy 5: Catalog Grid Media Mapping** (`ProductCard.tsx`): "Blue Denim Jacket" product card renders running shoes image asset.
- **Easy 6: Quantity Counter Negative Floor** (`BuyBox.tsx`): Quantity decrement button drops counter past 1 into 0, -1, -2, etc.
- **Easy 7: Mobile Viewport Action Overflow** (`app/cart/page.tsx`): Proceed to Checkout CTA has fixed width clipping horizontally on 375px screens.
- **Easy 8: Shipping Country Dropdown State** (`app/checkout/page.tsx`): Selecting an alternative country immediately reverts selection to first option.
- **Easy 9: Floating Tooltip Mouseout Handling** (`app/checkout/page.tsx`): CVV info icon tooltip persists on cursor exit.
- **Easy 10: Authentication Password Mask Toggle** (`app/login/page.tsx`): Password field defaults to plain visible text and only masks when clicking the eye icon.
- **Easy 11: Required Form Validation Enforcement** (`app/contact/page.tsx`): Submitting Contact Us form with blank Email bypasses client validation.
- **Easy 12: FAQ Collapsible Accordion State** (`app/faq/page.tsx`): Clicking the header of an open FAQ accordion panel fails to toggle it closed.
- **Easy 13: Footer Legal Navigation Target** (`Footer.tsx`): "Privacy Policy" link routes to non-existent `/privacy-policy-statement` (renders 404).
- **Easy 14: Cookie Banner Z-Index Stacking** (`CookieBanner.tsx`): Fixed cookie overlay renders over footer newsletter submit button, intercepting clicks.
- **Easy 15: Navigation Target Attribute Logic** (`Footer.tsx`): Internal footer links open in new tab (`target="_blank"`), while external social links lack `target="_blank"`.
- **Easy 16: Review Filter Inversion** (`ReviewSection.tsx`): Filtering by "1 Star" displays 5-star reviews due to comparison logic error (`>` instead of `===`).
- **Easy 17: Out-of-Bounds Pagination** (`app/s/page.tsx`): Next Page button remains active beyond total pages, returning blank states.
- **Easy 18: Currency Conversion Loss** (`lib/utils.ts`): Switching currency to CAD drops prices by 25% due to inverted exchange rate multiplier (`* 0.75`).

### Part II: Medium Defects (1–21) [5 Base pts | +5 Speed Bonus | Max 10 pts]
- **Medium 1: Case-Sensitive Search Matching** (`api/products/route.ts`): Searching lowercase "headphones" returns 0 matches while capitalized "Headphones" returns matches.
- **Medium 2: Faceted Filter State Overwrite** (`app/s/page.tsx`): Selecting a filter in a second facet (Category + Brand) overwrites the first facet query.
- **Medium 3: Lexicographical Catalog Sort** (`app/s/page.tsx`): "Price: Low to High" sort compares prices as strings, placing $100 before $20.
- **Medium 4: Catalog Pagination Boundary** (`app/s/page.tsx`): Generates an extra page link at the end that renders an empty state.
- **Medium 5: Quick View Focus Management** (`QuickViewModal.tsx`): Opening Quick View modal fails to trap Tab keyboard focus within container.
- **Medium 6: Wishlist State Synchronization** (`ProductCard.tsx`): Returning to catalog after adding item to wishlist resets heart icon to unselected.
- **Medium 7: Iterative Coupon Application** (`store/cartStore.ts`): Submitting same valid promo code (e.g. `SAVE10`) repeatedly compounds percentage discount.
- **Medium 8: Line Item Quantity Multiplication** (`app/cart/page.tsx`): Increasing item quantity updates quantity count but leaves line subtotal at single-unit price.
- **Medium 9: Form Autofill Event Binding** (`app/checkout/page.tsx`): Autofilling shipping address leaves Continue button disabled until manual keystroke occurs.
- **Medium 10: Post-Discount Tax Evaluation** (`app/checkout/page.tsx`): Calculates sales tax against pre-discount subtotal rather than discounted balance.
- **Medium 11: Regional Currency Symbol Consistency** (`app/checkout/page.tsx`): Catalog displays in USD (`$`), but final review step swaps symbol to EUR (`€`) without numeric conversion.
- **Medium 12: Card Field Formatting Space Handling** (`app/checkout/page.tsx`): Pasting card numbers with spaces counts spaces toward `maxLength={16}`, truncating last 3 digits.
- **Medium 13: Submission Button Debouncing** (`app/checkout/page.tsx`): Rapidly clicking "Place Order" fails to disable button, allowing duplicate orders.
- **Medium 14: Address Management List Indexing** (`app/account/addresses/page.tsx`): Clicking Delete on second address entry deletes the first record instead.
- **Medium 15: User Profile File Upload MIME Validation** (`api/users/profile/route.ts`): Profile avatar selector accepts `.txt` or `.pdf` files without validation error.
- **Medium 16: Registration Password Confirmation Match** (`app/register/page.tsx`): Submits and provisions account even when Password and Confirm Password do not match.
- **Medium 17: Post-Authentication Checkout Redirect** (`app/login/page.tsx`): Signing in when prompted from checkout clears return destination and redirects to `/`.
- **Medium 18: Cart Quantity Overwrite** (`store/cartStore.ts`): Adding an already-in-cart item resets its cart quantity to 1 instead of incrementing.
- **Medium 19: Whitespace Validation Bypass** (`app/checkout/page.tsx`): ZIP code required validation is bypassed by entering a single whitespace character.
- **Medium 20: Variant Pricing Failure** (`components/BuyBox.tsx`): Selecting expensive variant updates UI display but adds lower base price to cart.
- **Medium 21: Infinite Scroll Duplication** (`app/s/page.tsx`): Scrolling past end of search results endlessly duplicates the first few products.

### Part III: Hard Defects (1–16) [10 Base pts | +10 Speed Bonus | Max 20 pts]
- **Hard 1: Order Payload Pricing Authority** (`api/orders/route.ts`): Server checkout processor accepts user-provided unit pricing from request body instead of database.
- **Hard 2: Order History Parameter Enumeration** (`api/orders/[id]/route.ts`): Order receipt endpoint lacks ownership check, allowing viewing other customers' orders by incrementing ID.
- **Hard 3: Administrative Route Access Control** (`app/admin/users/page.tsx`): Direct navigation to `/admin/users` as standard customer renders user console without authorization check.
- **Hard 4: Post-Logout Session Validity** (`lib/tokenRevocation.ts`): Signing out fails to invalidate backend token, allowing Authorization header to continue retrieving user profile.
- **Hard 5: Password Reset Token Invalidation** (`api/auth/reset-password/route.ts`): Completing password reset fails to expire recovery link, leaving token reusable infinitely.
- **Hard 6: Login Redirect Parameter Handling** (`app/login/page.tsx`): Redirect handler fails to validate `?redirect=` against internal relative paths (Open Redirect).
- **Hard 7: User Review Field Encoding** (`ReviewSection.tsx`): Review text rendered via `dangerouslySetInnerHTML`, allowing inline HTML/XSS payloads.
- **Hard 8: Guest-to-User Cart Merging** (`store/cartStore.ts`): Signing in with active guest cart overwrites and wipes user's saved account cart items.
- **Hard 9: Storage Synchronization Conflict** (`store/cartStore.ts`): Deleting item in Tab A followed by updating quantities in Tab B overwrites `localStorage` and resurrects deleted item.
- **Hard 10: Order State Transition Validation** (`api/orders/[id]/cancel/route.ts`): Cancellation endpoint allows marking a "Delivered" order as "Cancelled".
- **Hard 11: Cart Quantity Boundary Validation** (`api/cart/route.ts`): Backend mutation accepts negative quantities (e.g. `quantity: -5`), reducing cart subtotal balance.
- **Hard 12: Session Storage Cleanup on Sign-Out** (`context/AuthContext.tsx`): Logging out fails to clear `localStorage`, retaining cached masked card and address data.
- **Hard 13: Profile Update Parameter Filtering** (`api/users/profile/route.ts`): Endpoint fails to filter restricted attributes, allowing users to pass `{ role: "admin" }` to escalate privileges.
- **Hard 14: Case-Sensitive Promo Stacking** (`api/coupons/validate/route.ts`): Promo codes lack case normalization, allowing `WELCOME10` and `welcome10` to stack indefinitely on same order.
- **Hard 15: Truncation Tax Evasion** (`app/checkout/page.tsx`): Merged with Medium 10; truncates taxable subtotal via `Math.floor()` before computing sales tax, dropping taxable cents.
- **Hard 16: Max Quantity Race Condition** (`BuyBox.tsx`): Rapidly clicking "Add to Cart" dispatches concurrent updates bypassing async inventory limit checks.

### Part IV: Treasure Bugs (Rule 3.3 Flag Challenges) [10 Flat pts Each]
- **Treasure Bug #1 (Console Leak)**: Clicking the main product image on PDP exactly 7 times outputs to browser console:  
  `TREASURE_BUG_#1: RkxBR3s3X2NsaWNrc191bmxvY2tlZF9zZWNyZXRfdHJlYXN1cmV9`
- **Treasure Bug #3 (DOM Source Inspection)**: Inspecting DOM HTML comments reveals:  
  `TREASURE_BUG_#3: FLAG{inspect_element_dom_source_revealed}`

---

## 🛠️ Tech Stack Architecture
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS with Amazon color tokens (`#131921`, `#232f3e`, `#febd69`, `#ffa41c`, `#ffd814`, `#eaeded`)
- **Database**: PostgreSQL with Prisma ORM (`DATABASE_URL`, `DIRECT_URL`)
- **State Management**: Zustand with `localStorage` persistence
- **Icons**: Lucide React
- **Authentication**: JWT & bcryptjs

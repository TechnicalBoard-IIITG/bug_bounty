const assert = require("assert");

const BASE_URL = "http://localhost:3005";

async function runTests() {
  console.log("=== STARTING ACCOUNT ISOLATION TESTS ===");

  const teamAlpha = "team_alpha_" + Date.now();
  const teamBeta = "team_beta_" + Date.now();

  console.log(`Team Alpha ID: ${teamAlpha}`);
  console.log(`Team Beta ID:   ${teamBeta}`);

  // TEST 1: Initial stock should be identical for both teams (e.g. 45 for prod-e1)
  console.log("\n[TEST 1] Initial Stock Equality");
  const resAlpha1 = await fetch(`${BASE_URL}/api/products/prod-e1`, {
    headers: { "x-account-id": teamAlpha },
  });
  const prodAlpha1 = await resAlpha1.json();

  const resBeta1 = await fetch(`${BASE_URL}/api/products/prod-e1`, {
    headers: { "x-account-id": teamBeta },
  });
  const prodBeta1 = await resBeta1.json();

  console.log(`Team Alpha prod-e1 stock: ${prodAlpha1.stock}`);
  console.log(`Team Beta prod-e1 stock:   ${prodBeta1.stock}`);
  assert.strictEqual(prodAlpha1.stock, 45, "Team Alpha initial stock must be 45");
  assert.strictEqual(prodBeta1.stock, 45, "Team Beta initial stock must be 45");
  console.log("✓ PASS: Initial stock is identical for both accounts");

  // TEST 2: Team Alpha purchases 5 items
  console.log("\n[TEST 2] Team Alpha Order Placement");
  const orderResAlpha = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-account-id": teamAlpha,
    },
    body: JSON.stringify({
      userId: teamAlpha,
      items: [
        {
          productId: "prod-e1",
          title: "Sony WH-1000XM5 Wireless Headphones",
          unitPrice: 348.0,
          quantity: 5,
        },
      ],
      subtotal: 1740,
      discount: 0,
      tax: 0,
      shippingFee: 0,
      total: 1740,
    }),
  });
  const orderDataAlpha = await orderResAlpha.json();
  assert(orderDataAlpha.success, "Team Alpha order must succeed");
  const orderId = orderDataAlpha.order.id || orderDataAlpha.order.orderNumber;
  console.log(`Team Alpha created order: ${orderId} (Quantity: 5)`);

  // TEST 3: Check isolated stock
  console.log("\n[TEST 3] Isolated Stock Verification");
  const resAlpha2 = await fetch(`${BASE_URL}/api/products/prod-e1`, {
    headers: { "x-account-id": teamAlpha },
  });
  const prodAlpha2 = await resAlpha2.json();

  const resBeta2 = await fetch(`${BASE_URL}/api/products/prod-e1`, {
    headers: { "x-account-id": teamBeta },
  });
  const prodBeta2 = await resBeta2.json();

  console.log(`Team Alpha prod-e1 stock after purchase: ${prodAlpha2.stock} (expected 40)`);
  console.log(`Team Beta prod-e1 stock:                 ${prodBeta2.stock} (expected 45)`);
  assert.strictEqual(prodAlpha2.stock, 40, "Team Alpha stock must decrease to 40");
  assert.strictEqual(prodBeta2.stock, 45, "Team Beta stock MUST remain 45 (unaffected!)");
  console.log("✓ PASS: Team Alpha purchase only affected Team Alpha stock!");

  // TEST 4: Orders isolation
  console.log("\n[TEST 4] Orders Isolation");
  const ordersAlphaRes = await fetch(`${BASE_URL}/api/orders`, {
    headers: { "x-account-id": teamAlpha },
  });
  const ordersAlpha = (await ordersAlphaRes.json()).orders;

  const ordersBetaRes = await fetch(`${BASE_URL}/api/orders`, {
    headers: { "x-account-id": teamBeta },
  });
  const ordersBeta = (await ordersBetaRes.json()).orders;

  const alphaHasOrder = ordersAlpha.some((o) => o.id === orderId || o.orderNumber === orderId);
  const betaHasOrder = ordersBeta.some((o) => o.id === orderId || o.orderNumber === orderId);

  console.log(`Team Alpha has order ${orderId}: ${alphaHasOrder}`);
  console.log(`Team Beta has order ${orderId}:   ${betaHasOrder}`);
  assert(alphaHasOrder, "Team Alpha order list must contain their order");
  assert(!betaHasOrder, "Team Beta order list must NOT contain Team Alpha's order");
  console.log("✓ PASS: Orders are strictly isolated per account!");

  // TEST 5: Order cancellation restores stock for that account
  console.log("\n[TEST 5] Order Cancellation Restores Stock");
  const cancelRes = await fetch(`${BASE_URL}/api/orders/${orderId}/cancel`, {
    method: "POST",
    headers: { "x-account-id": teamAlpha },
  });
  const cancelData = await cancelRes.json();
  assert(cancelData.success, "Cancellation must succeed");

  const resAlpha3 = await fetch(`${BASE_URL}/api/products/prod-e1`, {
    headers: { "x-account-id": teamAlpha },
  });
  const prodAlpha3 = await resAlpha3.json();
  console.log(`Team Alpha prod-e1 stock after cancel: ${prodAlpha3.stock} (expected 45)`);
  assert.strictEqual(prodAlpha3.stock, 45, "Stock must be restored to 45 upon cancellation");
  console.log("✓ PASS: Order cancellation restores stock for that account!");

  // TEST 6: Shared Reviews / Comments
  console.log("\n[TEST 6] Shared Reviews / Comments");
  const reviewComment = `Automated Review from Team Alpha at ${Date.now()}`;
  const reviewRes = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: "prod-e1",
      rating: 5,
      title: "Shared Review Test",
      comment: reviewComment,
      userName: "Team Alpha Tester",
      userId: teamAlpha,
    }),
  });
  const reviewData = await reviewRes.json();
  assert(reviewData.success, "Review creation must succeed");

  // Team Beta fetches prod-e1 details
  const resBetaProd = await fetch(`${BASE_URL}/api/products/prod-e1`, {
    headers: { "x-account-id": teamBeta },
  });
  const prodBetaWithReview = await resBetaProd.json();
  const foundReview = prodBetaWithReview.reviews?.some((r) => r.comment === reviewComment);
  console.log(`Team Beta sees Team Alpha's review comment: ${foundReview}`);
  assert(foundReview, "Team Beta MUST see reviews submitted by Team Alpha!");
  console.log("✓ PASS: Comments/reviews are globally shared across all accounts!");

  // TEST 7: Address Book Isolation
  console.log("\n[TEST 7] Address Book Isolation");
  const addAddrRes = await fetch(`${BASE_URL}/api/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-account-id": teamAlpha,
    },
    body: JSON.stringify({
      userId: teamAlpha,
      fullName: "Alpha Custom Address",
      street: "777 Alpha Blvd",
      city: "AlphaCity",
      state: "AC",
      pincode: "12345",
      country: "United States",
      isDefault: false,
    }),
  });
  const newAddr = (await addAddrRes.json()).address;

  const addrAlpha = (await (await fetch(`${BASE_URL}/api/addresses`, { headers: { "x-account-id": teamAlpha } })).json()).addresses;
  const addrBeta = (await (await fetch(`${BASE_URL}/api/addresses`, { headers: { "x-account-id": teamBeta } })).json()).addresses;

  const alphaHasAddr = addrAlpha.some((a) => a.fullName === "Alpha Custom Address");
  const betaHasAddr = addrBeta.some((a) => a.fullName === "Alpha Custom Address");

  console.log(`Team Alpha has custom address: ${alphaHasAddr}`);
  console.log(`Team Beta has custom address:   ${betaHasAddr}`);
  assert(alphaHasAddr, "Team Alpha must have custom address");
  assert(!betaHasAddr, "Team Beta must NOT have Team Alpha's custom address");
  console.log("✓ PASS: Address books are isolated per account!");

  console.log("\n=========================================");
  console.log("ALL 7 ACCOUNT ISOLATION TESTS PASSED 100%!");
  console.log("=========================================\n");
}

runTests().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});

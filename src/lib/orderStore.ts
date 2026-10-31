export interface InMemoryOrder {
  id: string;
  orderNumber: string;
  userId: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

export const DEFAULT_DEMO_ORDERS: InMemoryOrder[] = [
  {
    id: "112-8492041-5928310",
    orderNumber: "112-8492041-5928310",
    userId: "guest",
    subtotal: 348.0,
    discount: 0,
    tax: 27.84,
    shippingFee: 0,
    total: 375.84,
    status: "Delivered", // Target for HARD_10 defect
    createdAt: "2026-10-14T10:30:00.000Z",
    items: [
      {
        id: "it-hist-1",
        title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
        unitPrice: 348.0,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      },
    ],
  },
  {
    id: "112-1049281-4920194",
    orderNumber: "112-1049281-4920194",
    userId: "guest",
    subtotal: 89.99,
    discount: 0,
    tax: 0,
    shippingFee: 0,
    total: 89.99,
    status: "Processing",
    createdAt: "2026-10-16T08:15:00.000Z",
    items: [
      {
        id: "it-hist-2",
        title: "Logitech MX Master 3S Wireless Performance Mouse",
        unitPrice: 89.99,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      },
    ],
  },
];

const memoryOrders: InMemoryOrder[] = JSON.parse(JSON.stringify(DEFAULT_DEMO_ORDERS));

export function addInMemoryOrder(order: InMemoryOrder): void {
  memoryOrders.unshift(order);
}

export function findInMemoryOrder(idOrOrderNumber: string): InMemoryOrder | undefined {
  return memoryOrders.find((o) => o.id === idOrOrderNumber || o.orderNumber === idOrOrderNumber);
}

export function updateInMemoryOrderStatus(idOrOrderNumber: string, status: string): InMemoryOrder | null {
  const ord = memoryOrders.find((o) => o.id === idOrOrderNumber || o.orderNumber === idOrOrderNumber);
  if (ord) {
    ord.status = status;
    return ord;
  }
  return null;
}

export function getInMemoryOrders(userId?: string | null): InMemoryOrder[] {
  if (!userId || userId === "guest") {
    return memoryOrders;
  }
  return memoryOrders.filter((o) => o.userId === userId || o.userId === "guest");
}

export function resetInMemoryOrders(): void {
  memoryOrders.length = 0;
  memoryOrders.push(...JSON.parse(JSON.stringify(DEFAULT_DEMO_ORDERS)));
}

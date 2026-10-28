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

const memoryOrders: InMemoryOrder[] = [];

export function addInMemoryOrder(order: InMemoryOrder): void {
  memoryOrders.unshift(order);
}

export function getInMemoryOrders(userId?: string | null): InMemoryOrder[] {
  if (!userId || userId === "guest") {
    return memoryOrders;
  }
  return memoryOrders.filter((o) => o.userId === userId);
}

export function resetInMemoryOrders(): void {
  memoryOrders.length = 0;
}

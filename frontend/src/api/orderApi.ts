import api from "./axios";
import type { ShippingAddress, ShippingOption, PaymentMethodType } from "../types/checkout";

export interface CreateOrderPayload {
  items: Array<{
    productId?: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    selectedColor?: string;
  }>;
  shippingAddress: ShippingAddress;
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export interface BackendOrder {
  _id: string;
  id?: string;
  orderNumber: string;
  user: string | { _id: string; name: string; email: string };
  items: Array<{
    product?: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    selectedColor?: string;
  }>;
  shippingAddress: ShippingAddress;
  shippingOption: {
    name: string;
    price: number;
    estimate: string;
  };
  paymentMethod: PaymentMethodType;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: "Processing" | "In Transit" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListResponse {
  success: boolean;
  count: number;
  totalRevenue?: number;
  orders: BackendOrder[];
}

export interface SingleOrderResponse {
  success: boolean;
  message?: string;
  order: BackendOrder;
}

/**
 * Place a new order in MongoDB
 */
export const createOrderApi = async (
  payload: CreateOrderPayload
): Promise<BackendOrder> => {
  const response = await api.post<SingleOrderResponse>("/orders", payload);
  return response.data.order;
};

/**
 * Fetch current user's order history
 */
export const getMyOrdersApi = async (): Promise<BackendOrder[]> => {
  const response = await api.get<OrdersListResponse>("/orders/my-orders");
  return response.data.orders;
};

/**
 * Admin: Fetch all orders across customers
 */
export const getAllOrdersApi = async (): Promise<{
  orders: BackendOrder[];
  totalRevenue: number;
}> => {
  const response = await api.get<OrdersListResponse>("/orders");
  return {
    orders: response.data.orders,
    totalRevenue: response.data.totalRevenue || 0,
  };
};

/**
 * Admin: Update order status (Processing, In Transit, Delivered, Cancelled)
 */
export const updateOrderStatusApi = async (
  orderId: string,
  status: string
): Promise<BackendOrder> => {
  const response = await api.put<SingleOrderResponse>(
    `/orders/${orderId}/status`,
    { status }
  );
  return response.data.order;
};

import api from "./axios";
import type { BackendOrder } from "./orderApi";

export interface CreateCheckoutSessionResponse {
  success: boolean;
  url: string;
  sessionId: string;
}

export interface VerifySessionResponse {
  success: boolean;
  message: string;
  order: BackendOrder;
}

/**
 * Initiate Stripe Checkout session
 */
export const createStripeCheckoutSession = async (
  orderPayload: any
): Promise<CreateCheckoutSessionResponse> => {
  const response = await api.post<CreateCheckoutSessionResponse>(
    "/payment/create-checkout-session",
    orderPayload
  );
  return response.data;
};

/**
 * Verify Stripe session and retrieve confirmed order from MongoDB
 */
export const verifyStripeSession = async (
  sessionId: string
): Promise<BackendOrder> => {
  const response = await api.get<VerifySessionResponse>(
    `/payment/verify-session/${sessionId}`
  );
  return response.data.order;
};

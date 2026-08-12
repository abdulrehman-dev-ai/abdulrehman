import { createPayfastSignature } from "@/lib/orders";

interface PayfastConfig {
  merchantId: string;
  securedKey: string;
  merchantName: string;
  tokenUrl: string;
  checkoutUrl: string;
}

interface CheckoutInput {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerPhone: string;
  description: string;
  successUrl: string;
  failureUrl: string;
  callbackUrl: string;
}

export function getPayfastConfig(): PayfastConfig | null {
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const securedKey = process.env.PAYFAST_SECURED_KEY;
  const merchantName = process.env.PAYFAST_MERCHANT_NAME || "Abdul Rehman Tech Solutions";
  const isProduction = process.env.PAYFAST_ENV === "production";

  if (!merchantId || !securedKey) {
    return null;
  }

  return {
    merchantId,
    securedKey,
    merchantName,
    tokenUrl: isProduction
      ? process.env.PAYFAST_PRODUCTION_TOKEN_URL ||
        "https://ipg.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken"
      : process.env.PAYFAST_SANDBOX_TOKEN_URL ||
        "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken",
    checkoutUrl: isProduction
      ? process.env.PAYFAST_PRODUCTION_CHECKOUT_URL ||
        "https://ipg.apps.net.pk/Ecommerce/api/Transaction/PostTransaction"
      : process.env.PAYFAST_SANDBOX_CHECKOUT_URL ||
        "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction",
  };
}

export async function getPayfastAccessToken(
  config: PayfastConfig,
  amount: number,
  basketId: string,
) {
  const body = new URLSearchParams({
    MERCHANT_ID: config.merchantId,
    SECURED_KEY: config.securedKey,
    TXNAMT: amount.toString(),
    BASKET_ID: basketId,
    CURRENCY_CODE: "PKR",
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to get PayFast access token");
  }

  const token = data.ACCESS_TOKEN || data.token || data.TOKEN;

  if (!token) {
    throw new Error("PayFast access token missing in response");
  }

  return token as string;
}

export async function buildPayfastCheckout(input: CheckoutInput) {
  const config = getPayfastConfig();

  if (!config) {
    throw new Error(
      "PayFast is not configured yet. Add PAYFAST_MERCHANT_ID and PAYFAST_SECURED_KEY to your environment.",
    );
  }

  const token = await getPayfastAccessToken(config, input.amount, input.orderId);
  const signature = createPayfastSignature(
    config.merchantId,
    config.merchantName,
    input.amount,
    input.orderId,
  );
  const orderDate = new Date().toISOString().replace("T", " ").slice(0, 19);
  const checkoutCallback = `signature=${signature}&order_id=${input.orderId}`;

  return {
    action: config.checkoutUrl,
    fields: {
      CURRENCY_CODE: "PKR",
      MERCHANT_ID: config.merchantId,
      MERCHANT_NAME: config.merchantName,
      TOKEN: token,
      BASKET_ID: input.orderId,
      TXNAMT: input.amount.toString(),
      ORDER_DATE: orderDate,
      SUCCESS_URL: input.successUrl,
      FAILURE_URL: input.failureUrl,
      CHECKOUT_URL: input.callbackUrl,
      CUSTOMER_EMAIL_ADDRESS: input.customerEmail,
      CUSTOMER_MOBILE_NO: input.customerPhone,
      SIGNATURE: signature,
      VERSION: "NEXTJS-PAYFAST-1.0",
      TXNDESC: input.description,
      PROCCODE: "00",
      TRAN_TYPE: "ECOMM_PURCHASE",
    },
  };
}

"use client";

import { useState } from "react";
import {
  Button,
  Column,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
} from "@/once-ui/components";
import { business, payments } from "@/app/resources/content";
import styles from "./OrderCheckout.module.scss";

type PaymentMethod = "bank_transfer" | "card";

interface OrderCheckoutProps {
  serviceSlug: string;
  serviceTitle: string;
  price: string;
  currency?: string;
  priceNote?: string;
}

interface PayfastCheckoutResponse {
  action: string;
  fields: Record<string, string>;
}

function submitPayfastForm(checkout: PayfastCheckoutResponse) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = checkout.action;

  Object.entries(checkout.fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export function OrderCheckout({
  serviceSlug,
  serviceTitle,
  price,
  currency = "PKR",
  priceNote = "Starting from",
}: OrderCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      serviceSlug,
      customerName,
      customerEmail,
      customerPhone,
      company,
      notes,
      paymentMethod,
    };

    try {
      if (paymentMethod === "bank_transfer") {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to place order.");
        }

        window.location.href = data.redirectUrl;
        return;
      }

      const response = await fetch("/api/payfast/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start card payment.");
      }

      submitPayfastForm(data.checkout as PayfastCheckoutResponse);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <Column
      id="order"
      fillWidth
      maxWidth="xs"
      border="neutral-medium"
      radius="l"
      padding="24"
      gap="20"
      background="surface"
      className={styles.checkout}
    >
      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">
          Place Your Order
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Complete the form below and choose your preferred payment method.
        </Text>
      </Column>

      <Flex
        fillWidth
        border="neutral-medium"
        radius="m"
        padding="16"
        gap="4"
        direction="column"
        background="neutral-alpha-weak"
      >
        <Text variant="body-default-s" onBackground="neutral-weak">
          {serviceTitle}
        </Text>
        <Text variant="body-default-xs" onBackground="neutral-weak">
          {priceNote}
        </Text>
        <Heading variant="heading-strong-l" onBackground="brand-strong">
          {currency} {price}
        </Heading>
      </Flex>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Column gap="16">
          <Input
            id="customerName"
            label="Full Name"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
          />
          <Input
            id="customerEmail"
            label="Email Address"
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            required
          />
          <Input
            id="customerPhone"
            label="Phone Number"
            type="tel"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            required
          />
          <Input
            id="company"
            label="Company (optional)"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
          <Textarea
            id="notes"
            label="Project Notes (optional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            lines={4}
          />

          <Column gap="12">
            <Text variant="heading-strong-s">Payment Method</Text>
            <Flex gap="12" direction="column">
              {payments.methods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`${styles.methodCard} ${
                    paymentMethod === method.id ? styles.methodCardActive : ""
                  }`}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                >
                  <Flex direction="column" gap="4" horizontal="start">
                    <Text variant="heading-strong-s">{method.label}</Text>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {method.description}
                    </Text>
                  </Flex>
                </button>
              ))}
            </Flex>
          </Column>

          {paymentMethod === "bank_transfer" && (
            <Column
              gap="8"
              border="neutral-medium"
              radius="m"
              padding="16"
              background="neutral-alpha-weak"
            >
              <Text variant="heading-strong-s">Bank Transfer Details</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Bank: {payments.bankTransfer.bankName}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Account Title: {payments.bankTransfer.accountTitle}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Account Number: {payments.bankTransfer.accountNumber}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                IBAN: {payments.bankTransfer.iban}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {payments.bankTransfer.instructions}
              </Text>
            </Column>
          )}

          {paymentMethod === "card" && (
            <Column
              gap="8"
              border="neutral-medium"
              radius="m"
              padding="16"
              background="neutral-alpha-weak"
            >
              <Text variant="heading-strong-s">Secure Card Payment</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                You will be redirected to PayFast to pay securely with Visa or Mastercard.
                PayFast is a State Bank of Pakistan licensed payment gateway.
              </Text>
            </Column>
          )}

          {error && (
            <Text variant="body-default-s" onBackground="danger-strong">
              {error}
            </Text>
          )}

          <Button type="submit" variant="primary" fillWidth loading={loading}>
            {paymentMethod === "card" ? "Pay with Card" : "Place Order"}
          </Button>

          <Text variant="body-default-xs" onBackground="neutral-weak">
            Need help? Contact {business.email} or {business.phone}
          </Text>
        </Column>
      </form>
    </Column>
  );
}

// app/checkoutResponse/page.js
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutResponsePart1 from "@/Components/CheckoutResponse/CheckoutResponsePart1";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutResponsePage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutResponsePart1 />
    </Elements>
  );
}
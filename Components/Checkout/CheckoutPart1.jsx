"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentIntent } from "@/RTK/Thunks/PaymentThunks";
import { motion } from "framer-motion";

const CheckoutPart1 = ({ amount }) => {
    const dispatch = useDispatch();
    const { clientSecret, paymentIntentID, status } = useSelector((state) => state.StoreOfPayment);
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (amount > 0 && !clientSecret) {
            dispatch(createPaymentIntent(amount));
        }
    }, [amount, dispatch, clientSecret]);
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage("Payment system not ready. Please wait...");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) throw submitError;

            if (!clientSecret) {
                throw new Error("Payment session expired. Please try again.");
            }

            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/checkoutResponse?payment_intent=${paymentIntentID}&payment_intent_client_secret=${clientSecret}`,
                },
                redirect: "if_required",
            });

            if (error) throw error;

            if (status === 'succeeded') {
                window.location.href = `/checkoutResponse?payment_intent=${paymentIntentID}&payment_intent_client_secret=${clientSecret}`;
            }
        } catch (err) {
            setErrorMessage(err.message || "Payment failed. Please try again.");
            console.error("Payment error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!stripe || !elements || (amount > 0 && !clientSecret)) {
        return <div className="flex justify-center items-center h-32">Loading payment gateway...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#E8E4D9] p-6 rounded-lg shadow-md max-w-[50%]">
            <PaymentElement options={{ layout: "tabs" }} />

            {errorMessage && (
                <div className="text-red-500 my-4 p-2 bg-red-50 rounded">
                    {errorMessage}
                </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Order total</span>
                    <span className="font-medium text-gray-900">${amount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                    By completing your purchase, you agree to our Terms of Service.
                </p>
            </div>

            <motion.button
                initial={{ background: '#0f1210', scale: 1 }}
                whileHover={{ background: '#0f1210ec' }}
                whileTap={{ background: '#0f1210', scale: 0.95 }}
                transition={{ duration: 0.2 }}
                type="submit"
                disabled={!stripe || loading || status !== "succeeded"}
                className="w-full py-4 px-6 my-2  text-white rounded-lg font-semibold cursor-pointer"
            >
                {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
            </motion.button>
        </form>
    );
};

export default CheckoutPart1;
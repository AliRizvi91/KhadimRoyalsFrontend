"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
// Components
import CheckoutPart1 from "@/Components/Checkout/CheckoutPart1";
import convertToSubcurrency from "@/Components/Checkout/ConvertToSubcurrency";
// import AnimatedText from "@/Components/Utilities/AnimatedText";
const AnimatedText = dynamic(
  () => import('@/Components/Utilities/AnimatedText'),
  { ssr: false }
);
import FadeDown from "@/Components/Utilities/FadeDown";
import { useDispatch, useSelector } from "react-redux";
// RTK
import { getAllBook } from '@/RTK/Thunks/Bookthunks';
import { setUserBookings } from '@/RTK/Slices/BookSlice';

// Validate Stripe key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(true);
  const amount = useSelector((state) => 
    state.StoreOfBook?.currentUserBookingsTotalAmount || 0
  );
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.StoreOfUser || {});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        await dispatch(getAllBook());
        if (user?._id) {
          await dispatch(setUserBookings(user._id));
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [dispatch, user?._id]);

  // Don't render Stripe Elements until amount is valid
  if (isLoading) {
    return (
      <div className="h-[100vh] w-full p-10 text-white bg-gradient-to-tr from-black to-[#3b3b3b] flex items-center justify-center">
        <p>Loading payment information...</p>
      </div>
    );
  }

  if (amount <= 0) {
    return (
      <div className="h-[100vh] w-full p-10 text-white bg-gradient-to-tr from-black to-[#3b3b3b] flex items-center justify-center">
        <p>Invalid payment amount. Please ensure you have items to checkout.</p>
      </div>
    );
  }
  return (
    <div className="h-[100vh] w-full p-10 text-white bg-gradient-to-tr from-black to-[#3b3b3b]">
      <div className="text-center flex flex-col justify-center items-center h-full w-full">
        <div className="h-20 w-px bg-white opacity-40 mx-auto" />
        
        <div className="mb-10 text-center flex flex-col justify-center items-center">
          <h1 className="md:text-[3.5rem] sm:text-[3rem] text-[2rem] font-semibold">
            <AnimatedText delay={0.5}>Payment Integration</AnimatedText>
          </h1>
          <FadeDown duration={1.2} YAxis={10} className="w-[60%]">
            <p className="md:text-[14px] sm:text-[11px] text-[9px] manrope mb-7">
              Payment integration is like a warm hug for your business, seamlessly 
              connecting you with your customers in the most convenient way.
            </p>
          </FadeDown>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd"
          }}
        >
          <CheckoutPart1 amount={amount} />
        </Elements>
      </div>
    </div>
  );
}
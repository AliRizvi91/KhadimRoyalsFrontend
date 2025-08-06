import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from 'sonner';
import { useDispatch, useSelector } from "react-redux";
import { getAllBook, updateBookingsOfArray } from '@/RTK/Thunks/Bookthunks';
import { setUserBookings } from '@/RTK/Slices/BookSlice';
import { PostPayment } from '@/RTK/Thunks/PaymentThunks';
import Loader from "../Custom/Loader";


const CheckoutResponsePart1 = () => {
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paymentProcessedRef = useRef(false); // Using ref to track processing state
  const [bookingsLoaded, setBookingsLoaded] = useState(false);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.StoreOfUser);
  const { currentUserBookings } = useSelector((state) => state.StoreOfBook);

  const loadUserBookings = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      if(user !== null){
        await dispatch(getAllBook());
        await dispatch(setUserBookings(user._id));
        setBookingsLoaded(true);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
      toast.error("Failed to load booking information");
    }
  }, [dispatch, user?._id]);

  const checkPaymentStatus = useCallback(async () => {
    if (!stripe || !clientSecret || paymentProcessedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

      if (!paymentIntent) {
        throw new Error("Payment verification failed");
      }

      setPaymentStatus(paymentIntent.status);

      if (paymentIntent.status === "succeeded" && !paymentProcessedRef.current) {
        if (!bookingsLoaded) {
          await loadUserBookings();
          return; // Exit and let the effect run again after bookings load
        }

        if (currentUserBookings.length === 0) {
          throw new Error("No bookings found for this user");
        }

        paymentProcessedRef.current = true; // Mark as processed immediately

        const CurrentUserBookingIds = currentUserBookings.map(booking => booking._id)
        const paymentData = {
          bookingIds: CurrentUserBookingIds,
          amount: paymentIntent.amount / 100,
          paymentStatus: 'completed',
          transactionId: paymentIntent.id,
        };

        await dispatch(PostPayment({ data: paymentData })).then(()=>{
          return dispatch(updateBookingsOfArray({Data:CurrentUserBookingIds}))
        })
      }

      if (paymentIntent.status === "failed") {
        throw new Error(paymentIntent.last_payment_error?.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      console.error("Payment processing error:", err);
    } finally {
      setLoading(false);
    }
  }, [stripe, clientSecret, bookingsLoaded, currentUserBookings, loadUserBookings, dispatch]);

  useEffect(() => {
    loadUserBookings();
  }, [loadUserBookings]);

  useEffect(() => {
    if (bookingsLoaded) {
      checkPaymentStatus();
    }
  }, [bookingsLoaded, checkPaymentStatus]);

  // ... rest of your component UI remains the same ...
  const handleContinue = () => router.push('/');
  const handleRetry = () => router.push('/checkout');

  if (!stripe || !elements) {
    return <div className="flex justify-center items-center h-screen bg-[#E8E4D9]">Loading payment information...</div>;
  }

  if (loading || paymentStatus === "processing") {
    return(
      <Loader Text={`Processing your payment...`} className={`h-screen`}/>
    )
  }

  return (
    <div className="p-0">
      {paymentStatus === "succeeded" ? (
        <div className="h-screen w-full bg-[#E8E4D9] flex flex-col justify-center items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Image src="/assets/Images/SuccessCheckout.png" alt="SuccessCheckout" width={400} height={400} className="object-cover" />
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-4xl font-semibold mt-7">
            Thank you for your order!
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="text-lg w-[70%] text-center mb-7">
            Your payment was successful. We've received your order and will process it shortly.
          </motion.p>
          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9 }}
            whileHover={{ backgroundColor: 'rgba(15, 18, 16, 0.9)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-[30%] py-4 px-6 mb-7 bg-[#0f1210] text-white rounded-lg font-semibold cursor-pointer"
          >
            Continue Shopping
          </motion.button>
        </div>
      ) : (
        <div className="h-screen w-full bg-[#E8E4D9] flex flex-col justify-center items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Image src="/assets/Images/FailedCheckout.png" alt="FailedCheckout" width={400} height={400} className="object-cover" />
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-4xl font-semibold mt-7">
            Payment Failed
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="text-lg w-[70%] text-center mb-7">
            {error || 'Your payment could not be processed. Please try again.'}
          </motion.p>
          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9 }}
            whileHover={{ backgroundColor: 'rgba(15, 18, 16, 0.9)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRetry}
            className="w-[30%] py-4 px-6 mb-7 bg-[#0f1210] text-white rounded-lg font-semibold cursor-pointer"
          >
            Try Again
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CheckoutResponsePart1;
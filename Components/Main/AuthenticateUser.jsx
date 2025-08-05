import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getme } from '@/RTK/Thunks/UserThunks';

function AuthenticateUser({ children }) {
  const dispatch = useDispatch();
  const { token, user, loading, error } = useSelector((state) => state.StoreOfUser);

  useEffect(() => {
    // Only fetch user data if we have a token but no user data and not already loading
    if (token && !user && !loading) {
      dispatch(getme())
        .unwrap() // This gives you the actual action payload or throws an error
        .catch(err => {
          console.error('Failed to fetch user data:', err);
          // You might want to clear the token here if the request fails
          // dispatch(logout()); // If you have a logout action
        });
    }
  }, [dispatch, token, user, loading]);

  // Optional: Handle loading or error states
  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error loading user data</div>;
  }

  return <>{children}</>;
}

export default React.memo(AuthenticateUser);
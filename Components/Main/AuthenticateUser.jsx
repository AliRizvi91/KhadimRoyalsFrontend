import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getme } from '@/RTK/Thunks/UserThunks';

function AuthenticateUser({ children }) {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.StoreOfUser);

  useEffect(() => {
    // Only fetch user data if we have a token but no user data and not already loading
    if (token !== null || undefined && user === null && !loading) {
      dispatch(getme()).catch(err => {
        console.error('Failed to fetch user data:', err);
      });
    }
  }, [dispatch, token]); // Removed 'user' from dependencies to prevent loop

  return <>{children}</>;
}

export default React.memo(AuthenticateUser);
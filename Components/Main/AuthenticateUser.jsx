import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getme } from '@/RTK/Thunks/UserThunks';

function AuthenticateUser({ children }) {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.StoreOfUser);

  useEffect(() => {
    // Only run if we have a token but no user data
    if (token && !user && !loading) {
      dispatch(getme())
        .unwrap()
        .catch(err => {
          console.error('Failed to fetch user data:', err);
          // Optionally dispatch logout action here if the token is invalid
        });
    }
  }, [dispatch, token]); // Only depend on token and dispatch

  return <>{children}</>;
}

export default React.memo(AuthenticateUser);
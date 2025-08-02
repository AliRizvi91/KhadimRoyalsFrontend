import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getme } from '@/RTK/Thunks/UserThunks';

function AuthenticateUser({ children }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.StoreOfUser);

  useEffect(() => {
    // Only fetch user data if we have a token but no user data
    if (token && !user) {
      dispatch(getme()).catch(err => {
        console.error('Failed to fetch user data:', err);
      });
    }
  }, [dispatch, token, user]); // Only run when these values change

  return <>{children}</>;
}

export default React.memo(AuthenticateUser);
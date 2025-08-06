import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getme } from '@/RTK/Thunks/UserThunks';

function AuthenticateUser({ children }) {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.StoreOfUser);
  
  
  useEffect(() => {
    // Only run if we have a token but no user data
    if (token !== "undefined" && token && !user && !loading) {
      
      dispatch(getme())
        .unwrap();
    }
  }, [dispatch, token]); // Only depend on token and dispatch

  return <>{children}</>;
}

export default React.memo(AuthenticateUser);
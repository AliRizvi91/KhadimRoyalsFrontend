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
        .then((userData) => {
          console.log("User loaded:", userData);
        })
        .catch((error) => {
          console.error("Failed to load user:", error.message);
          if (error.status === 401 || error.status === 402) {
            // Redirect to login
            router.push("/login");
          }
        });
    }
  }, [dispatch, token]); // Only depend on token and dispatch

  return <>{children}</>;
}

export default React.memo(AuthenticateUser);
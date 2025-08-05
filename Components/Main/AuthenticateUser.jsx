function AuthenticateUser({ children }) {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(getme())
        .unwrap()
        .catch((err) => {
          console.error("Auth check failed:", err);
          // Optional: dispatch(logout()) if token is invalid
        });
    }
  }, [token]); // Only depends on `token` to prevent loops

  return <>{children}</>;
}
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { data, errorMessage } = useSelector((state) => state.rootReducer.auth);
  const isAuth = !!data && errorMessage === null;
  return { isAuth };
};

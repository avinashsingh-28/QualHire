import { useAuthContext } from '../context/AuthContext';

/**
 * Convenience hook for consuming AuthContext
 */
const useAuth = () => useAuthContext();

export default useAuth;

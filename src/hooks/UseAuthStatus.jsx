
import {useEffect,useState} from 'react'
import { supabase } from '../supabaseClient';
const UseAuthStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  return { isLoading, isLoggedIn };
}

export default UseAuthStatus

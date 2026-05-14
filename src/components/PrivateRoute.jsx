
import {Navigate,Outlet} from 'react-router-dom'
import UseAuthStatus from '../hooks/UseAuthStatus'
import Spinner from './Spinner'
const PrivateRoute = () => {
    const {isLoading,isLoggedIn}=UseAuthStatus()
    if(isLoading){
        return <Spinner />;
    }
  return isLoggedIn ? <Outlet /> : <Navigate to="/Signin" />
}

export default PrivateRoute

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Explore from './pages/Explore'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import PrivateRoute from './components/PrivateRoute'
import ForgotPassword from './pages/ForgotPassword'
import Category from './pages/Category'
import CreateListing from './pages/CreateListing'
import Listing  from './pages/Listing'
import Contact from './pages/Contact'
import EditListing from './pages/EditListing'
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
            <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/category/:categoryName/:id" element={<Listing />}/>
          <Route path="contact/:OwnerId" element={<Contact />}/>
          <Route path="/edit-listing/:listingId" element={<EditListing />}/>
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}
export default App;

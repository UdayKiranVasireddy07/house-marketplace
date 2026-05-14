import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Error sending password reset email:");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="emailInput"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />


          <Link to="/signin" className="forgotPasswordLink">
            Sign In
            <ArrowRightIcon fill="#2c2c2c" width="34px" height="34px" />
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Email</div>
            <button type="submit" className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
            <p>{isLoading ? "Sending..." : "Password reset email will be sent to your inbox."}</p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;

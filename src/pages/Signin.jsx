import React from "react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Error signing in: " + error.message);
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome...!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}> 
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <img
                src={visibilityIcon}
                alt="show password"
                className="showPassword"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>
            <Link to="/forgotpassword" className="forgotPasswordLink">
              Forgot Password
            </Link>
            <div className="signInBar">
               <p className="signInText">Sign In</p>
               <button className="signInButton" >
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
               </button>
            </div>
          </form>
          <OAuth />
                <Link to="/SignUp" className="registerLink">
                  Don't have an account..? Register
                </Link>
        </main>
      </div>
    </>
  );
}

export default Signin;

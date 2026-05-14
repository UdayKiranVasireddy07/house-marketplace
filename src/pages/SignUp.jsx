import React from "react";
import {toast} from "react-toastify";
import { supabase } from "../supabaseClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();
 const onSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name }, 
      },
    });

    if (error) throw error;

    if (data.user) {
      const { error: dbError } = await supabase
        .from("users")
        .insert([
          {
            id: data.user.id,
            name: name,
            email: email,
          },
        ]);

      if (dbError) {
        console.error("DB Insert Error:", dbError.message);
          toast.error("Error saving user data: " + dbError.message);
      }

      if (data.session) {
        navigate("/");
      } else {
        toast.info("Check your email for the confirmation link!");
        navigate("/signin");
      }
    }
  } catch (error) {
    toast.error("Registration error: " + error.message);
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
              type="text"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
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
                onClick={(e) => setShowPassword((prevState) => !prevState)}
              />
            </div>
            <Link to="/forgotpassword" className="forgotPasswordLink">
              Forgot Password
            </Link>
            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to="/SignIn" className="registerLink">
            Already have an account..? Sign In
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignUp;

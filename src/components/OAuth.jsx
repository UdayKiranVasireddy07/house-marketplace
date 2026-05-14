import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";


function OAuth() {
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const handleOAuthLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) throw error;
    } catch (error) {
      toast.error("Error occurred during OAuth login: " + error.message);
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/Signin" ? "in" : "up"} with</p>
      <div className="socialButtons">
        <button
          className="socailIconDiv"
          onClick={() => handleOAuthLogin("google")}
        >
          <img
            className="socialIconImg"
            id="google-icon"
            src={googleIcon}
            alt="Google"
          />
      
        </button>
       
      </div>
    </div>
  );
}

export default OAuth;

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
function Contact() {
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  useEffect(() => {
    const getOwner = async () => {
      // 1. Guard against the "undefined" error
      if (!params.OwnerId || params.OwnerId === "undefined") {
        console.error("No valid OwnerId found in URL");
        return;
      }

      const { data, error } = await supabase
        .from("users") // Use 'users' as seen in your Table Editor
        .select("*")
        .eq("id", params.OwnerId)
        .single();

      if (error) {
        toast.error("Could not get owner data");
      } else {
        setOwner(data);
      }
    };

    getOwner();
  }, [params.OwnerId]);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact header</p>
        {owner !== null && (
          <main>
            <div className="contactLandLord">
              <p className="landLordName">{owner?.name}</p>
            </div>
            <form action="" className="messageForm">
              <div className="messageDiv">
                <label htmlFor="message" className="messageLabel">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  className="textarea"
                  value={message}
                  onChange={onChange}
                ></textarea>
              </div>
              <button
                className="primaryButton"
                type="button"
                onClick={() => {
                  window.location.href = `mailto:${owner.email}?Subject=${searchParams.get("listingName")}&body=${message}`;
                }}
              >
                Send Message
              </button>
            </form>
          </main>
        )}
      </header>
    </div>
  );
}

export default Contact;

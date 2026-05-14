import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      if (data.user) {
        setUser(data.user);
        setFormData({
          name: data.user.user_metadata.name || "",
          email: data.user.email || "",
        });
      }
    };
    fetchUserData();
  }, []);
  const { name, email } = formData;
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        navigate("/");
      } else {
        toast.error("Error signing out:");
      }
    } catch (error) {
      toast.error("Error signing out:", error.message);
    }
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("user_ref", user.id)
          .order("timestamp", { ascending: false });

        if (error) {
          toast.error("Error getting user's listings");
          return;
        }

        const listing = data.map((doc) => ({
          id: doc.id,
          data: doc,
        }));

        setListings(listing);
      } catch (err) {
        toast.error("Unexpected error fetching listings");
      } finally {
        setLoading(false);
      }
    };
    fetchUserListings();
  }, []);

  const onSubmit = async () => {
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: name },
      });
      if (authError) throw authError;

      const { error: tableError } = await supabase
        .from("users")
        .update({ name: name, email: email })
        .eq("id", user.id);

      if (tableError) throw tableError;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Could not update profile details");
    }
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onDelete = async (listingId) => {
  if (window.confirm('Are you sure you want to delete this listing?')) {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);
        const updatedListings=listings.filter((listing)=>listing.id!==listingId);
        setListings(updatedListings)
        toast.success("Successfully deleted listing")

      if (error) throw error;
      
    } catch (error) {
      console.error('Error deleting listing:', error.message);
      alert('Failed to delete listing.');
    }
  }
};
const onEdit=(listingId)=>navigate(`/edit-listing/${listingId}`);
  return (
    <>
      <div className="profile">
        <header className="profileHeader">
          <p className="pageheader">My Profile</p>
          <button className="logOut" type="button" onClick={onLogout}>
            Log Out
          </button>
        </header>
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "change"}
            </p>
          </div>
          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <input
                type="text"
                id="email"
                className={
                  !changeDetails ? "profileEmail" : "profileEmailActive"
                }
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
          <Link to="/create-listing" className="createListing">
            <img src={homeIcon} alt="home" />
            <p>Sell or rent your home</p>
            <img src={arrowRight} alt="arrow right" />
          </Link>

          {!loading && listings?.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingsList">
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={()=>onEdit(listing.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Profile;

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";
function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offers: false,
    regularPrice: null,
    discountedPrice: null,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offers,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a listing");
        navigate("/signin");
      } else {
        setFormData((prevState) => ({
          ...prevState,
          user_ref: user.id,
        }));
      }
    };
    checkUser();
  }, [navigate]);
  if (loading) {
    return <Spinner />;
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (discountedPrice > regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be less than regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }
    let geolocation = { lat: null, lng: null };
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        {
          headers: {
            "User-Agent": "MyHouseMarketplaceApp", // Just a name to identify your project
          },
        },
      );
      const data = await response.json();
      if (data.length === 0) {
        setLoading(false);
        toast.error("Address not found, please make sure it is correct");
        return; // Stop the function here
      } else {
        location = data[0].display_name;
        geolocation.lat = parseFloat(data[0].lat);
        geolocation.lng = parseFloat(data[0].lon);
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }
    const storeImg = async (image) => {
      const filePath = `/${image.name}-${uuidv4()}`;

      const { data, error } = await supabase.storage
        .from("House-photos")
        .upload(filePath, image);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("House-photos")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    };

    const image_urls = await Promise.all(
      [...images].map((image) => storeImg(image)),
    ).catch(() => {
      setLoading(false);
      toast.error("error in uploading images");
      return;
    });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("You must be logged in to create a listing");
      return;
    }
    const formDataCopy = {
      ...formData,
      image_urls,
      geolocation:`POINT(${geolocation.lng} ${geolocation.lat})`,
      latitude:geolocation.lat,
      longitude:geolocation.lng,
      timestamp: new Date().toISOString(), 
      user_ref: user.id,
    };
    delete formDataCopy.images;
    delete formDataCopy.address;
    location && (formDataCopy.location = location);
    !formData.offers && delete formDataCopy.discountedPrice;
    try {
      const { data, error } = await supabase
        .from("listings")
        .insert([formDataCopy])
        .select();

      if (error) throw error;

      toast.success("Listing saved successfully!");
      navigate(`/category/${formDataCopy.type}/${data[0].id}`);
      
    } catch (error) {
      console.error("Database Error:", error.message);
      toast.error("Could not save listing to database");
    }
    setLoading(false);
  };

  const onMutate = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  return (
    <div className="profile">
      <header>
        <p className="pageHheader">Create Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label htmlFor="" className="formLabel">
            Sell/Rent
          </label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label className="formLabel">Name</label>
          <input
            type="text"
            className="formInputName"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="40"
            minLength="10"
            required
          />
          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                type="number"
                className="formInputSmall"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="10"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                type="number"
                className="formInputSmall"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="10"
                required
              />
            </div>
          </div>
          <label className="formLabel">Parking Spots</label>
          <div className="formButtons">
            <button
              type="button"
              className={parking ? "formButtonActive" : "formButton"}
              id="parking"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label htmlFor="" className="formLabel">
            Furnished
          </label>
          <div className="formButtons">
            <button
              type="button"
              className={furnished ? "formButtonActive" : "formButton"}
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label htmlFor="" className="formLabel">
            Address
          </label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />
          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  type="number"
                  className="formInputSmall"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  step="0.0001"
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  type="number"
                  className="formInputSmall"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  step="0.0001"
                  required
                />
              </div>
            </div>
          )}

          <label htmlFor="" className="formLabel">
            Offer
          </label>
          <div className="formButtons">
            <button
              type="button"
              className={offers ? "formButtonActive" : "formButton"}
              id="offers"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !offers && offers !== null ? "formButtonActive" : "formButton"
              }
              id="offers"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label htmlFor="" className="formLabel">
            Regular Price
          </label>
          <div className="formPriceDiv">
            <input
              type="number"
              className="formInputSmall"
              id="regularPrice"
              value={Number(regularPrice)}
              onChange={onMutate}
              min="100"
              max="1000000"
              required
            />

            {type === "rent" && <p className="formPriceText">&#8377;/ Month</p>}
          </div>
          {offers && (
            <>
              <label htmlFor="" className="formLabel">
                Discounted Price
              </label>
              <input
                type="number"
                className="formInputSmall"
                id="discountedPrice"
                
                value={Number(discountedPrice)}
                onChange={onMutate}
                min="100"
                required={offers}
                max="1000000"
              />
            </>
          )}
          <label htmlFor="" className="formLabel">
            Images
          </label>
          <p className="imagesInfo">
            The first image will be the cover Image (max 6 Images)
          </p>
          <input
            type="file"
            className="formInputFile"
            id="images"
            max="6"
            onChange={onMutate}
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button className="primaryButton createListingButton" type="submit">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;

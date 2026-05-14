import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharreLinkCopied, setShareLinkCopied] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        toast.error("Error fetching listing");
        setLoading(false);
      } else {
        setListing(data);
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id, navigate]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      {listing && listing.image_urls.length > 0 && (
        <Swiper style={{ height: '300px' }} slidesPerView={1} modules={[Navigation, Pagination, Scrollbar, A11y]} pagination={{ clickable: true }} navigation>
          {listing.image_urls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url("${url}") center / cover no-repeat`, // Added quotes around ${url}
                  height: "300px", // MUST have a height defined
                  width: "100%",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>
      {sharreLinkCopied && <p className="linkCopied">Link Copied..!</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name}-&#8377;{" "}
          {listing.offers
            ? listing.discountedPrice.toLocaleString()
            : listing.regularPrice.toLocaleString()}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offers && (
          <p className="discountedPrice">
            &#8377;
            {listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>

        {/* 1. Only render the map if listing and the nested geolocation keys exist */}
        {listing?.latitude && listing?.longitude ? (
          <div className="leafletContainer">
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={[listing.latitude, listing.longitude]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[listing.latitude, listing.longitude]}>
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          // 2. Show a placeholder or spinner while waiting for the coordinates
          <p>No coordinates available</p>
        )}
        {listing && listing.user_ref && (
          <Link
            to={`/contact/${listing.user_ref}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Owner
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;

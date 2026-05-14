import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(10);
      if (error) {
        setLoading(false);
        toast.error("error in getting Images ");
      }
      let listings = [];
      data.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc,
        });
      });

      setListings(listings);
      setLoading(false);
    };
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }
    if(listings.length===0){
      
      return true;
    }
  
  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url("${data.image_urls[0]}") center no-repeat`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "400px",
                  width: "100%",
                }}
                className="swiperSlideDiv"
              >
                <p className="swiperSlideText">
                  {data.name}
                  <span className="swiperSlidePrice">
                    &#8377;
                    {data.offers
                      ? Number(data.discountedPrice).toLocaleString()
                      : Number(data.regularPrice).toLocaleString()}{" "}
                    {data.type === "rent" && "/month"}
                  </span>
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;

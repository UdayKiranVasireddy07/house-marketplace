import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
   const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("offers", true)
          .order("timestamp", { ascending: false })
          .limit(10);
        if (error) {
          toast.error("Error fetching listings");
          console.error("Error fetching listings:", error);
        } else {
          setListings(data);
          const lastVisible = data[data.length - 1];
          setLastFetchedListing(lastVisible);
        }
      } catch (error) {
        toast.error("Unexpected error occurred");
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);
   const FetchMoreListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("offers", true)
        .lt("timestamp", lastFetchedListing.timestamp)
        .order("timestamp", { ascending: false })
        .limit(10);
      if (error) {
        toast.error("Error fetching listings");
        console.error("Error fetching listings:", error);
      } else {
        if (data.length > 0) {
          setListings((prevState) => [...prevState, ...data]);
          const lastVisible=data[data.length-1]
          setLastFetchedListing(lastVisible);
          
        } else {
          setLastFetchedListing(null)
          toast.info("No more listings");
        }
      }
    } catch (error) {
      toast.error("Unexpected error occurred");
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))}
            </ul>
          </main>
              <br /><br />
          {lastFetchedListing &&(
            <p className="loadMore" onClick={FetchMoreListings}>Load more</p>
          )}
        </>
      ) : (
        <p>No Offers available</p>
      )}
    </div>
  );
}

export default Offers;

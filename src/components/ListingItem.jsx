import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";



import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
const ListingItem = ({ listing, onEdit, onDelete }) => {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${listing.id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.image_urls[0]}
          alt={listing.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <h3 className="categoryListingName">{listing.name}</h3>
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingPrice">
            &#8377;
            {listing.offers
              ? listing.discountedPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="categoryListingInfo">
            <img src={bedIcon} alt="Bed" />
            <p className="categoryListingInfoText">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </p>
            <img src={bathtubIcon} alt="Bathtub" />
            <p className="categoryListingInfoText">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231, 76, 60)"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
      {onEdit && (
        <EditIcon className="editIcon" size={20} color="#333" onClick={() => onEdit(listing.id)} />
      )}
    </li>
  );
};

export default ListingItem;

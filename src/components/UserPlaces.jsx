import { useEffect, useState } from "react";
import { getSavedPlaces } from "../api/places";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

function UserPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      const stored = localStorage.getItem("places-token");
      const token = stored ? JSON.parse(stored).token : null;

      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const res = await getSavedPlaces(token);

      if (res.success) {
        const parsedPlaces = res.data.map((place) => ({
          ...place,
          photos: place.photos ? JSON.parse(place.photos) : [],
        }));
        setPlaces(parsedPlaces);
      } else {
        setError(res.message);
      }

      setLoading(false);
    };

    fetchPlaces();
  }, []);

  if (loading) return <Loading loadingText="장소 불러오는 중" />;
  if (error) return <p className="error-text">{error}</p>;
  if (!places.length)
    return <p className="empty-text">아직 등록된 장소가 없습니다.</p>;

  return (
    <div className="user-places-grid">
      {places.map((place) => {
        const photoUrl = place.photos?.[0] || "/no-image.jpg";

        return (
          <div key={place.id} className="place-card">
            <div className="place-thumbnail">
              <img src={photoUrl} alt={place.placeName} />
            </div>
            <div className="place-info">
              <h3 className="place-name">{place.placeName}</h3>
              <div className="place-rating">
                <FaStar className="star-icon" />
                {place.rating} ({place.userRatingsTotal})
              </div>
              <div className="place-address">
                <FaMapMarkerAlt className="map-icon" />
                {place.placeAddress}
              </div>
              <div className="place-meta">
                <span className="reg-date">
                  등록일 : {new Date(place.regDate).toLocaleDateString()}
                </span>
              </div>
              <button
                className="detail-button"
                onClick={() =>
                  navigate("/", {
                    state: {
                      lat: place.lat,
                      lng: place.lng,
                      placeId: place.placeId,
                    },
                  })
                }
              >
                지도에서 보기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UserPlaces;
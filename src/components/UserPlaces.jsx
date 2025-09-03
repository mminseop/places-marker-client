import { useEffect, useState } from "react";
import { deletePlace, getSavedPlaces } from "../api/places";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { alertComfirm } from "../utils/alert";

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

  const handleDelete = async (placeId) => {
    const stored = localStorage.getItem("places-token");
    const token = stored ? JSON.parse(stored).token : null;

    try {
      await alertComfirm(
        "정말 삭제하시겠습니까?",
        "삭제한 장소는 복구할 수 없습니다."
      );
      const res = await deletePlace(placeId, token);

      if (res.success) {
        setPlaces((prev) => prev.filter((p) => p.id !== placeId));
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      setError("삭제 요청 실패");
    }
  };

  if (loading) return <Loading loadingText="장소 불러오는 중" />;
  if (error) return <p className="error-text">{error}</p>;
  if (!places.length)
    return <p className="empty-text">아직 등록된 장소가 없습니다.</p>;

  return (
    <>
      <h2 className="user-places-title">나의 등록장소</h2>
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
                <div className="place-button-wrap">
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
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(place.id)}
                  >
                    삭제하기
                  </button>
                </div>
                <button
                  className="places-button"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/place/?q=place_id:${place.placeId}`,
                      "_blank"
                    )
                  }
                >
                  구글 플레이스에서 보기
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default UserPlaces;

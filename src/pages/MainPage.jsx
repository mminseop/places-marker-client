import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NaverMap from "../components/NaverMap";
import SearchModal from "../components/SearchModal";
import Header from "../components/Header";
import { getSavedPlaces } from "../api/places";
import { alertError } from "../utils/alert";

function MainPage() {
  const [markers, setMarkers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const location = useLocation();
  const { lat, lng, placeId } = location.state || {};

  useEffect(() => {
    const stored = localStorage.getItem("places-token");
    const token = stored ? JSON.parse(stored).token : null;
    if (!token) return;

    const getPlaces = async () => {
      const res = await getSavedPlaces(token);
      if (res.success) {
        const markerData = res.data.map((place) => ({
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lng),
          name: place.placeName,
          placeId: place.placeId,
        }));
        setMarkers(markerData);
      } else {
        alertError("불러오기 실패", "장소 목록을 불러오지 못했습니다.");
      }
    };

    getPlaces();
  }, []);

  return (
    <>
      <Header onOpenModal={() => setModalOpen(true)} />

      <div className="content-container">
        <NaverMap
          markers={markers}
          focusPlace={{ lat, lng, placeId }} // 📌 지도에서 보기로 넘어왔을 때만 값 존재
        />

        {modalOpen && (
          <SearchModal
            onClose={() => setModalOpen(false)}
            onSelect={(place) => {
              const markerData = {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
                name: place.name,
              };
              setMarkers((prev) => [...prev, markerData]);
            }}
          />
        )}
      </div>
    </>
  );
}

export default MainPage;
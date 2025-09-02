import { useEffect, useState } from "react";
import NaverMap from "../components/NaverMap";
import SearchModal from "../components/SearchModal";
import Header from "../components/Header";
import { getSavedPlaces } from "../api/places";
import { alertError } from "../utils/alert";

function MainPage() {
  const [markers, setMarkers] = useState([]); //마커 저장 상태(배열)
  const [modalOpen, setModalOpen] = useState(false); // 모달 토글 상태
  //   const userId = 3;
  const { lat, lng, placeId } = location.state || {};

  useEffect(() => {
    const stored = localStorage.getItem("places-token");
    const token = stored ? JSON.parse(stored).token : null;

    if (!token) return;

    const getPlaces = async () => {
      const res = await getSavedPlaces(token);
      //   console.log(res);
      if (res.success) {
        const markerData = res.data.map((place) => ({
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lng),
          name: place.placeName,
        }));
        setMarkers(markerData);
      } else {
        alertError("불러오기 실패", "장소 목록을 불러오지 못했습니다.");
      }
    };

    getPlaces();
  }, []);

  
  useEffect(() => {
    if (lat && lng) {
      console.log(lat, lng, placeId);
    }
  }, [lat, lng, placeId]);

  const handleSelectPlace = (place) => {
    const markerData = {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      name: place.name,
    };
    setMarkers((prev) => [...prev, markerData]);
  };

  return (
    <>
      {/* Header에 모달 여는 함수 넘기기 */}
      <Header onOpenModal={() => setModalOpen(true)} />

      <div className="content-container">
        <NaverMap markers={markers} />

        {modalOpen && (
          <SearchModal
            onClose={() => setModalOpen(false)}
            onSelect={handleSelectPlace}
          />
        )}
      </div>
    </>
  );
}

export default MainPage;

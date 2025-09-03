import { useEffect, useRef, useState } from "react";

function NaverMap({ markers, focusPlace }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (!window.naver) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.978),
        zoom: 12,
      });
    }

    const map = mapInstance.current;

    // 기존 마커 제거
    map.markers?.forEach((m) => m.setMap(null));
    map.markers = [];

    if (markers && markers.length > 0) {
      markers.forEach((m) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(m.lat, m.lng),
          map,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          setSelectedPlace(m); // 마커 클릭 시 사이드 패널에 정보 표시
        });

        map.markers.push(marker);
      });
    }

    if (focusPlace?.lat && focusPlace?.lng) {
      map.setCenter(new window.naver.maps.LatLng(focusPlace.lat, focusPlace.lng));
      map.setZoom(20);
    }
  }, [markers, focusPlace]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* 왼쪽 패널 */}
      {selectedPlace && (
        <div
          style={{
            width: "300px",
            background: "#fff",
            borderRight: "1px solid #ddd",
            padding: "16px",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <img
            src={selectedPlace.photos?.[0] || "/no-image.jpg"}
            alt={selectedPlace.name}
            style={{ width: "100%", height:"200px", borderRadius: "6px", marginBottom: "8px" }}
          />
          <h3 style={{ margin: "0 0 8px" }}>{selectedPlace.name}</h3>
          <p style={{ margin: "0 0 4px" }}>{selectedPlace.address}</p>
          <p style={{ margin: "0 0 4px" }}>
            ⭐ {selectedPlace.rating} ({selectedPlace.userRatingsTotal})
          </p>
          <button
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "8px",
              border: "none",
              borderRadius: "6px",
              background: "#3885c0",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => setSelectedPlace(null)}
          >
            닫기
          </button>
        </div>
      )}

      {/* 오른쪽 지도 */}
      <div ref={mapRef} style={{ flex: 1 }} />
    </div>
  );
}

export default NaverMap;
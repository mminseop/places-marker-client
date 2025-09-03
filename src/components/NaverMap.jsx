import { useEffect, useRef } from "react";

function NaverMap({ markers, focusPlace }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.naver) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.978),
        zoom: 12, // 기본 줌
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
        map.markers.push(marker);
      });
    }

    // focusPlace가 있을 때만 줌 당기기
    if (focusPlace.lat && focusPlace.lng) {
      map.setCenter(new window.naver.maps.LatLng(focusPlace.lat, focusPlace.lng));
      map.setZoom(20); // 지도에서 보기 눌렀을 때만 확대
    }
  }, [markers, focusPlace]);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}

export default NaverMap;
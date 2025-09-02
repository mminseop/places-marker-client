import { useEffect, useRef } from "react";
function NaverMap({ markers }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.naver) {
      console.warn("네이버 지도 SDK가 아직 로드되지 않았습니다.");
      return;
    }

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울
      zoom: 12,
    });

    if (markers && markers.length > 0) {
      markers.forEach((m) => {
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(m.lat, m.lng),
          map,
        });
      });

      // 첫 번째 마커로 지도 이동
      map.setCenter(
        new window.naver.maps.LatLng(markers[0].lat, markers[0].lng)
      );
    }
  }, [markers]);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}

export default NaverMap;

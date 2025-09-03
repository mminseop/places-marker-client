import { useState } from "react";
import { searchPlaces, savePlace } from "../api/places";
import Loading from "./Loading";
import { alertError, alertSuccess } from "../utils/alert";

function SearchModal({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);

    try {
      const res = await searchPlaces(query);
      console.log(res);
      if (res.success) {
        setResults(res.data || []);
        setPage(1);
      } else {
        alertError(
          "검색 실패",
          res.message || "장소 검색 중 오류가 발생했습니다."
        );
      }
    } catch (e) {
      console.error(e);
      alertError("검색 실패", "서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    const stored = localStorage.getItem("places-token");
    const token = stored ? JSON.parse(stored).token : null;

    if (!token) {
      alertError("저장 실패", "로그인이 필요합니다.");
      return;
    }

    if (selectedPlace) {
      try {
        const res = await savePlace(selectedPlace, token);
        console.log(res);
        if (res.success) {
          await alertSuccess("저장 성공", "선택한 장소가 저장되었습니다!");
          onSelect(selectedPlace);
          onClose();
        } else {
          alertError("저장 실패", "장소 저장에 실패했습니다.");
        }
      } catch (e) {
        console.error(e);
        alertError("저장 실패", "서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="search-modal-overlay">
      <div className="search-modal-box">
        {/* 검색창 */}
        <div className="search-modal-top-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            placeholder="장소를 검색하세요"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch} className="search-button">
            검색
          </button>
        </div>

        {/* 검색 결과 리스트*/}
        {isLoading ? (
          <Loading loadingText="장소 검색중" />
        ) : (
          <>
            <div className="results-list">
              {results?.length > 0 &&
                results.slice((page - 1) * 10, page * 10).map((place) => {
                  const photoUrl = place.photos?.[0]?.photo_reference
                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${
                        place.photos[0].photo_reference
                      }&key=${import.meta.env.VITE_GOOGLE_PLACE_KEY}`
                    : null;

                  return (
                    <div key={place.place_id} className="result-item">
                      {/* 이미지 */}
                      <img
                        src={photoUrl}
                        alt={place.name}
                        className="place-photo"
                      />

                      {/* 정보 */}
                      <div className="place-info">
                        <div className="place-name">{place.name}</div>
                        <div className="place-address">
                          {place.formatted_address}
                        </div>
                        <div className="place-rating">
                          ⭐ {place.rating} ({place.user_ratings_total})
                        </div>
                      </div>

                      {/* 선택 라디오 */}
                      <div className="select-radio">
                        <input
                          type="radio"
                          name="place"
                          checked={selectedPlace?.place_id === place.place_id}
                          onChange={() => setSelectedPlace(place)}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 페이지네이션 */}
            <div className="page-wrap">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                이전
              </button>
              <button
                disabled={page * 10 >= results.length}
                onClick={() => setPage(page + 1)}
              >
                다음
              </button>
            </div>

            {/* 하단 버튼 */}
            <div className="search-modal-button-wrap">
              <button onClick={handleConfirm} className="search-modal-button">
                확인
              </button>
              <button onClick={onClose} className="search-modal-button">
                취소
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchModal;

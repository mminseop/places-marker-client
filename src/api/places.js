import axios from "axios";

const EC2_HOST = import.meta.env.VITE_API_HOST;

const api = axios.create({
  baseURL: EC2_HOST,
});

// 검색
export async function searchPlaces(query) {
  try {
    const res = await api.get(`/api/places/search`, {
      params: { query },
    });

    if (res.data.result === "success") {
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message || "검색 실패" };
    }
  } catch (e) {
    console.error("Failed to fetch places:", e);
    return { success: false, message: "API 호출 실패" };
  }
}

// 장소 저장
export async function savePlace(place, token) {
  try {
    const res = await api.post(
      `/api/places/save`,
      {
        placeId: place.place_id,
        placeName: place.name,
        placeAddress: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating ?? null,
        userRatingsTotal: place.user_ratings_total ?? null,
        priceLevel: place.price_level ?? null,
        openingNow: place.opening_hours?.open_now ?? null,
        photos: place.photos ? place.photos.map((p) => p.photo_reference) : [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.result === "success") {
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message || "장소 저장 실패" };
    }
  } catch (e) {
    console.error("장소 DB 저장 실패 :", e);
    return { success: false, message: "장소 저장 요청 실패" };
  }
}

// 저장된 장소 불러오기
export async function getSavedPlaces(token) {
  try {
    const res = await api.get(`/api/places/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.result === "success") {
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message || "불러오기 실패" };
    }
  } catch (e) {
    console.error("api 호출 실패", e);
    return { success: false, message: "DB 조회 요청 실패" };
  }
}

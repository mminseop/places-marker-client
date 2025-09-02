import axios from "axios";

const EC2_HOST = import.meta.env.VITE_API_HOST;

const api = axios.create({
  baseURL: EC2_HOST,
});

// 회원가입
export async function registerUser({
  userEmail,
  userPassword,
  userName,
  userPhone,
}) {
  try {
    const res = await api.post("/api/auth/register", {
    // const res = await axios.post(`${EC2_HOST}/api/auth/register`, {
      userEmail,
      userPassword,
      userName,
      userPhone,
    });

    if (res.data.result === "success") {
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message || "회원가입 실패" };
    }
  } catch (e) {
    console.error("회원가입 실패:", e);
    return { success: false, message: "회원가입 요청 실패" };
  }
}

// 로그인
export async function loginUser({ userEmail, userPassword }) {
  try {
    const res = await api.post(`/api/auth/login`, {
      userEmail,
      userPassword,
    });

    if (res.data.result === "success") {
      const { accessToken, userId, userEmail: email } = res.data.data;

      // 토큰 저장
      localStorage.setItem(
        "places-token",
        JSON.stringify({
          token: accessToken,
          userId,
          userEmail: email,
        })
      );

      return { success: true, data: { accessToken, userId, userEmail } };
    } else {
      return { success: false, message: res.data.message || "로그인 실패" };
    }
  } catch (e) {
    console.error("로그인 실패:", e.response?.data ?? e.message);
    return { success: false, message: "로그인 요청 실패" };
  }
}

// 이메일 중복 체크
export async function checkEmail(userEmail) {
  try {
    const res = await api.post(`/api/auth/checkemail`, {
      userEmail,
    });
    
    // 문자열 비교로 사용 가능 여부 판단
    const available = res.data.data === "사용 가능한 이메일입니다.";
    if (available === true) return { success: available, message: res.data.data };
    else return { success: false, message: res.data.data };
    
  } catch (e) {
    console.error("이메일 중복 확인 실패:", e);
    return { success: false, message: "이메일 중복 확인 실패" };
  }
}

// 로그아웃
export function logoutUser(navigate) {
  localStorage.removeItem("places-token");
  navigate("/login");
}

import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUserCircle, FaCog, FaHeart } from "react-icons/fa";
import Header from "../components/Header";
import { getUserInfo } from "../api/auth";
import { useEffect, useState } from "react";

function MyPage() {
  const location = useLocation(); // 현재 경로 가져오기

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUserInfo();
        if (res.success) {
          setUser(res.data); // data 안에 userName, userEmail 가 있다고 가정
        } else {
          console.error(res.message);
        }
      } catch (error) {
        console.error("유저 정보 조회 중 에러 발생:", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <Header />
      <div className="my-page-container">
        <div className="my-page-side-bar">
          <div className="my-page-profile-wrap">
            <div className="my-page-profile-wrap-row">
              <FaUserCircle size={80} className="my-page-profile-icon" />
            </div>
            <div className="my-page-profile-wrap-row my-page-side-user-name">
              {user ? `${user.userName} 님!` : "로딩 중..."}
            </div>
            <div className="my-page-profile-wrap-row my-page-side-user-email">
              {user ? user.userEmail : ""}
            </div>
          </div>
          <div className="my-page-side-menu">
            <Link
              to="/mypage"
              className={`my-page-side-menu-row ${
                location.pathname === "/mypage" ? "selected" : ""
              }`}
            >
              <FaCog className="menu-icon" />
              계정 설정
            </Link>

            <Link
              to="/mypage/places"
              className={`my-page-side-menu-row ${
                location.pathname === "/mypage/places" ? "selected" : ""
              }`}
            >
              <FaHeart className="menu-icon" />
              나의 등록장소
            </Link>
          </div>
        </div>
        <div className="my-page-content-wrap">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MyPage;

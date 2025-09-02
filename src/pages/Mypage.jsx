import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUserCircle, FaCog, FaHeart } from "react-icons/fa";
import Header from "../components/Header";

function MyPage() {
  const location = useLocation(); // 현재 경로 가져오기

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
              {/* {user.user_metadata.name} 님! */}
            </div>
            <div className="my-page-profile-wrap-row my-page-side-user-email">
              {/* {user.email} */}
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

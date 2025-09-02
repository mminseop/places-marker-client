import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { alertSuccess } from "../utils/alert";

function Header({ onOpenModal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await alertSuccess("로그아웃 성공", "로그아웃 되었습니다.");
    logoutUser(navigate); // 토큰 삭제 + 리다이렉트
    setMenuOpen(false);
  };

  // 메뉴 바깥 클릭하면 닫히도록
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* 로고 */}
      <div className="header-logo" onClick={() => navigate("/")}>
        <img src="logo.webp" alt="로고" />
      </div>

      {/* 오른쪽 버튼들 */}
      <div className="header-button-wrap">
        <button
          onClick={onOpenModal}
          className="header-button place-add-button"
        >
          장소 추가하기
        </button>
        <div className="profile-menu" ref={menuRef}>
          <button
            className="header-button profile-icon"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <FaUserCircle size={24} />
          </button>
          {menuOpen && (
            <div className="profile-dropdown">
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/mypage");
                  setMenuOpen(false);
                }}
              >
                마이페이지
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

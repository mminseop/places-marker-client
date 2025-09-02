import { useState } from "react";
// import { useNavigate } from "react-router-dom";

function UserSettings() {
  const [activeMenu, setActiveMenu] = useState("basic"); // basic / security

  return (
    <>
      <h2>계정 설정</h2>
      <div className="my-page-content-menu-wrap">
        <div
          className={`my-page-content-menu-item ${
            activeMenu === "basic" ? "active" : ""
          }`}
          onClick={() => setActiveMenu("basic")}
        >
          기본정보
        </div>
        <div
          className={`my-page-content-menu-item ${
            activeMenu === "security" ? "active" : ""
          }`}
          onClick={() => setActiveMenu("security")}
        >
          보안
        </div>
      </div>

      {activeMenu === "basic" && (
        <div className="basic-settings">{/* FormGroup.jsx 사용 */}</div>
      )}

      {activeMenu === "security" && (
        <div className="security-settings">
          {/* FormGroup.jsx 사용 */}
          <div className="security-button-wrap">
            <button className="save-button">저장</button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserSettings;

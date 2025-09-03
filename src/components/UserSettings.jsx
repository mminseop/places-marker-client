import { useEffect, useState } from "react";
import FormGroup from "../components/FormGroup";
import { getUserInfo, updateUserInfo } from "../api/auth"; // updateUserInfo 함수 추가 필요
import { alertComfirm, alertError, alertSuccess } from "../utils/alert";

function UserSettings() {
  const [activeMenu, setActiveMenu] = useState("basic"); // basic / security
  const [formInput, setFormInput] = useState({
    userEmail: "",
    userName: "",
    userPhone: "",
  });
  const [errors, setErrors] = useState({});

  // 유저 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserInfo();
      if (res.success) {
        setFormInput({
          userEmail: res.data.userEmail,
          userName: res.data.userName || "",
          userPhone: res.data.userPhone || "",
        });
      } else {
        alertError("정보 불러오기 실패", res.message);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateField(name);
  };

  const validateField = (field) => {
    let message = "";
    switch (field) {
      case "userName":
        if (!formInput.userName.trim()) message = "이름을 입력하세요.";
        break;
      case "userPhone":
        if (!/^\d{10,11}$/.test(formInput.userPhone))
          message = "숫자만 입력, 10~11자리 입력하세요.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: message }));
    return !message;
  };

  const validateAll = () => {
    const fields = ["userName", "userPhone"];
    let valid = true;
    fields.forEach((f) => {
      if (!validateField(f)) valid = false;
    });
    return valid;
  };

  const handleSave = async () => {
    if (!validateAll()) return;

    try {
      await alertComfirm("회원정보 수정", "정말 수정하시겠습니까?");

      const res = await updateUserInfo({
        userName: formInput.userName,
        userPhone: formInput.userPhone,
      });

      if (res.success) {
        alertSuccess("저장 완료", "기본정보가 업데이트되었습니다.");
        setFormInput({
          userEmail: res.data.userEmail,
          userName: res.data.userName,
          userPhone: res.data.userPhone,
        });
      } else {
        alertError(
          "저장 실패",
          res.message || "기본정보 업데이트에 실패했습니다."
        );
      }
    } catch (err) {
      console.error("기본정보 저장 에러:", err);
      alertError("저장 실패", "서버 오류로 업데이트할 수 없습니다.");
    }
  };

  return (
    <>
      <h2 className="my-page-content-title">계정 설정</h2>
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
        <div className="basic-settings">
          <FormGroup
            label="이메일"
            name="userEmail"
            value={formInput.userEmail}
            disabled={true}
          />
          <FormGroup
            label="이름"
            name="userName"
            value={formInput.userName}
            onChange={handleChange}
            onBlur={handleBlur}
            errorMessage={errors.userName}
          />
          <FormGroup
            label="휴대폰 번호"
            name="userPhone"
            value={formInput.userPhone}
            onChange={handleChange}
            onBlur={handleBlur}
            errorMessage={errors.userPhone}
          />
          <button className="save-button" onClick={handleSave}>
            저장
          </button>
        </div>
      )}

      {activeMenu === "security" && (
        <div className="security-settings">
          <div className="security-button-wrap">
            <button className="save-button">저장</button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserSettings;

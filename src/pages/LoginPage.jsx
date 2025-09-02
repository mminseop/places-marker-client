import { useState } from "react";
import FormGroup from "../components/FormGroup";
import { useNavigate } from "react-router-dom";
import { alertError, alertSuccess } from "../utils/alert";
import { loginUser } from "../api/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateAll = () => {
    const newErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formInput.userEmail)) {
      newErrors.userEmail = "올바른 이메일 형식을 입력하세요.";
      //   setFormInput((prev) => ({ ...prev, userEmail: "" }));
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading(true);

    try {
      const res = await loginUser({
        userEmail: formInput.userEmail,
        userPassword: formInput.userPassword,
      });
      console.log(res);
      if (res.success) {
        await alertSuccess("로그인 성공", "환영합니다!");
        navigate("/");
      } else {
        alertError("로그인 실패", "로그인에 실패했습니다");
      }
    } catch (err) {
      console.error(err);
      alertError("로그인 실패", "서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* 로고 */}
      <div className="login-logo">
        <img src="/src/assets/logo.webp" alt="MyPlace 로고" />
      </div>

      {/* 문구 */}
      <p className="login-info">
        나만의 장소를 등록하고, 특별한 순간을 기록하세요.
      </p>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit}>
        <FormGroup
          label="이메일"
          name="userEmail"
          placeholder="example@domain.com"
          errorMessage={errors.userEmail}
          onChange={(e) =>
            setFormInput((prev) => ({ ...prev, userEmail: e.target.value }))
          }
        />
        <FormGroup
          label="비밀번호"
          name="userPassword"
          type="password"
          placeholder="비밀번호 입력"
          errorMessage={errors.userPassword}
          onChange={(e) =>
            setFormInput((prev) => ({ ...prev, userPassword: e.target.value }))
          }
        />

        {/* 로그인 버튼 */}
        <div className="login-btn-wrap">
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </div>

        {/* 회원가입 링크 */}
        <p className="signup-text">
          아직 회원이 아니신가요? 
          <span className="signup-link" onClick={() => navigate("/signup")}>
            가입하기
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;

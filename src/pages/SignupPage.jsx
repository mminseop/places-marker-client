import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormGroup from "../components/FormGroup";
import { alertError, alertSuccess } from "../utils/alert";
import { checkEmail, registerUser } from "../api/auth";

function SignupPage() {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({
    userEmail: "",
    userPassword: "",
    userPasswordConfirm: "",
    userName: "",
    userPhone: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // 입력시 기존 에러 초기화
    if (name === "userEmail") setEmailAvailable(null); // 이메일 변경 시 중복 상태 초기화
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateField(name);
  };

  const validateField = (field) => {
    let message = "";

    switch (field) {
      case "userEmail":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formInput.userEmail)) {
          message = "올바른 이메일 형식을 입력하세요.";
        }
        break;
      case "userPassword":
        if (!formInput.userPassword) message = "비밀번호를 입력하세요.";
        break;
      case "userPasswordConfirm":
        if (formInput.userPassword !== formInput.userPasswordConfirm)
          message = "비밀번호가 일치하지 않습니다.";
        break;
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

  const handleEmailCheck = async () => {
    if (!formInput.userEmail || errors.userEmail) return;

    setEmailChecking(true);
    try {
      const res = await checkEmail(formInput.userEmail);
      if (res.success) {
        setEmailAvailable(true);
        alertSuccess("사용 가능", "이메일 사용이 가능합니다.");
      } else {
        setEmailAvailable(null);
        alertError("이메일 중복", "이미 사용 중인 이메일입니다.");
        setErrors((prev) => ({
          ...prev,
          userEmail: "이미 사용 중인 이메일입니다.",
        }));
      }
    } catch (e) {
      console.error(e);
      alertError("중복확인 오류", "서버 확인 중 오류가 발생했습니다.");
    } finally {
      setEmailChecking(false);
    }
  };

  const validateAll = () => {
    const fields = Object.keys(formInput);
    let valid = true;
    fields.forEach((f) => {
      if (!validateField(f)) valid = false;
    });
    return valid && emailAvailable !== false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 이메일 중복 체크 여부 확인
    if (emailAvailable === null) {
      alertError("이메일 확인 필요", "이메일 중복 확인을 먼저 해주세요.");
      return;
    }

    if (!validateAll()) return;

    setIsLoading(true);
    try {
      const result = await registerUser({
        userEmail: formInput.userEmail,
        userPassword: formInput.userPassword,
        userName: formInput.userName,
        userPhone: formInput.userPhone,
      });

      if (result.success) {
        await alertSuccess("회원가입 성공", "로그인 해주세요!");
        navigate("/login");
      } else {
        alertError("회원가입 실패", result.error);
      }
    } catch (err) {
      console.error(err);
      alertError("회원가입 실패", "잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* 로고 */}
      <div className="login-logo">
        <img src="logo.webp" alt="로고" />
      </div>

      {/* 문구 */}
      <p className="login-info">
        회원가입 하셔서, 나만의 특별한 장소를 기록하세요.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="auth-email-button-wrap">
          <div className="email-row">
            <FormGroup
              label="이메일"
              name="userEmail"
              placeholder="example@domain.com"
              value={formInput.userEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.userEmail}
            />
            <button
              type="button"
              className="auth-btn secondary"
              onClick={handleEmailCheck}
              disabled={emailChecking || !formInput.userEmail}
            >
              {emailChecking ? "중복확인중..." : "중복확인"}
            </button>
          </div>
        </div>

        <FormGroup
          label="비밀번호"
          name="userPassword"
          type="password"
          placeholder="비밀번호 입력"
          value={formInput.userPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          errorMessage={errors.userPassword}
        />
        <FormGroup
          label="비밀번호 확인"
          name="userPasswordConfirm"
          type="password"
          placeholder="비밀번호 재입력"
          value={formInput.userPasswordConfirm}
          onChange={handleChange}
          onBlur={handleBlur}
          errorMessage={errors.userPasswordConfirm}
        />
        <FormGroup
          label="이름"
          name="userName"
          placeholder="홍길동"
          value={formInput.userName}
          onChange={handleChange}
          onBlur={handleBlur}
          errorMessage={errors.userName}
        />
        <FormGroup
          label="휴대폰 번호"
          name="userPhone"
          placeholder="01012345678"
          value={formInput.userPhone}
          onChange={handleChange}
          onBlur={handleBlur}
          errorMessage={errors.userPhone}
        />

        <div className="auth-btn-wrap">
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "회원가입중..." : "회원가입"}
          </button>
        </div>
        {/* 회원가입 링크 */}
        <p className="signup-text">
          이미 회원이신가요?
          <span className="signup-link" onClick={() => navigate("/login")}>
            로그인하기
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;

// 폼 입력(input)과 라벨(label), 에러 메시지를 함께 렌더링하는 재사용 가능한 컴포넌트
function FormGroup({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  errorMessage,
  disabled = false,
}) {
  return (
    <div className="form-wrap">
      {/* label과 input 연결 (htmlFor와 id가 같아야 함) */}
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type} // 입력 타입 (text, password 등)
        className={`form-input ${errorMessage ? "input-error" : ""}`} // 에러 시 클래스 추가
        placeholder={placeholder}
        value={value} // 현재 값 (state 연결)
        onChange={onChange} // 상태값 변경 시 실행 함수 (handleChange 호출)
        onBlur={onBlur} // 포커스 벗어날 때 실행 함수
        autoComplete="off" // 자동완성 끄기
        disabled={disabled}
      />
      {/* 에러메시지 있을때만 랜더링 */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default FormGroup;

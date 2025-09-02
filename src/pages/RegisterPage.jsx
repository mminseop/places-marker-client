import { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [form, setForm] = useState({
    userEmail: "",
    userPassword: "",
    userName: "",
    userPhone: ""
  });
  const [msg, setMsg] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://13.125.252.60:3000/auth/register", form);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="userEmail" placeholder="Email" onChange={handleChange} />
      <input name="userPassword" placeholder="Password" type="password" onChange={handleChange} />
      <input name="userName" placeholder="Name" onChange={handleChange} />
      <input name="userPhone" placeholder="Phone" onChange={handleChange} />
      <button type="submit">Register</button>
      <p>{msg}</p>
    </form>
  );
}

export default RegisterPage;
import { useState } from "react";
import Navbar from "./Navbar.jsx";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";  // take this in .env in prod url

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/v1/api/auth/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Store JWT and update global auth state
      login(res.data.token);

      // Redirect after successful login
      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Unable to connect to server");
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-24 flex justify-center items-center">
        <div className="flex justify-center items-center bg-stone-100 shadow-2xl md:w-50 lg:w-100 mx-auto my-10 p-20 rounded-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <h1 className="text-2xl font-semibold flex justify-center border-b-2 border-stone-300 pb-2">
              Login
            </h1>

            <label className="flex flex-col gap-2 font-medium">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-2 rounded-md"
              />
            </label>

            <label className="flex flex-col gap-2 font-medium">
              Password:
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="p-2 pr-10 rounded-md w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="text-red-600 font-semibold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="bg-stone-500 hover:bg-stone-300 transition-all text-white p-2 rounded-md"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
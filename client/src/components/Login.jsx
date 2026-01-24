import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendCredentials = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.100:3000/v1/api/auth/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response.data);
      setSuccess(response.data.message);
      setError(""); // clear error on success

    } catch (err) {
      setSuccess("");
      if (err.response) {
        // Backend error (400, 401, etc.)
        setError(err.response.data.message);
      } else {
        // Network / server issue
        setError("Unable to connect to server");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendCredentials();
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

            <label className="flex flex-col gap-2 font-medium">
              Role:
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="p-2 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 font-semibold text-center">
                {error}
              </div>
            )}

            {/* Sucess Message */}
            {success && (
              <div className='text-green-600 font-semibold text-center'>
                {success}
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

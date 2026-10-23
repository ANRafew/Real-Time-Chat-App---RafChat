import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully!");

    navigate("/edit-profile");
  };
  const handleGoLogin = async () => {
    navigate("/login");
  };
  return (
    <div className="text-center bg-sky-800 rounded-3xl md:mx-130 mx-20 my-50 py-8">
      <form onSubmit={handleRegister}>
        <h1 className="pb-5 text-3xl font-bold">Register</h1>

        <div className="pb-4">
          <input
            className="border rounded-2xl p-1 md:min-w-80"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="pb-4">
          <input
            className="border rounded-2xl p-1 md:min-w-80"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="border rounded-4xl px-3 py-1 text-xl bg-purple-800 hover:bg-purple-900" type="submit">
          Register
        </button>

        <div className="py-4 text-xl">
          <p>Already have an Account? 
          <button className="p-1 text-blue-400 underline hover:text-blue-500" 
                  type="button"
                  onClick={handleGoLogin}>
            Login
          </button> </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
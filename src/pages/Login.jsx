import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }
    // alert("Login successful!");
    navigate("/chat");
  };
  
  const handleGoRegister = async () => {
    navigate("/Register");
  };
  if (!Login) {
    return <p className="text-center">Loading...</p>;
  }


  return (
    <div className="text-center bg-sky-800 rounded-3xl md:mx-130 mx-5 my-50 py-8">
      <form onSubmit={handleLogin}>
        <h1 className="pb-5 text-3xl font-bold">Login</h1>

        <div className="p-3">
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
          Login
        </button>

        <div className="py-4 text-xl">
          <p>Don't have an Account? 
          <button className="p-1 text-blue-400 underline hover:text-blue-500" 
                  type="button"
                  onClick={handleGoRegister}>
            Register
          </button> </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Chat = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setUser(user);
    };

    getCurrentUser();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="">
      <div className="bg-slate-700 p-3 flex justify-between items-center">
        <p>RafChat</p>

        {user && (
          <div className="flex gap-3">
            <button onClick={handleEditProfile} className="border rounded-4xl px-3 py-1 text-l bg-purple-800 hover:bg-purple-900">
              Edit Profile
            </button>

            <button onClick={handleLogout} className="border rounded-4xl px-3 py-1 text-l bg-purple-800 hover:bg-purple-900">
              Logout
            </button>
          </div>
        )}
      </div>
    
    </div>
  );
};

export default Chat;

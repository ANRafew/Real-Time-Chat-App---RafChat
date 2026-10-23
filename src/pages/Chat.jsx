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
    <div>
      <h1>RafChat</h1>

      {user && (
        <>
          <p>Email: {user.email}</p>

          <button onClick={handleEditProfile}>
            Edit Profile
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Chat;

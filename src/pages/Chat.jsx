import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";

const Chat = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="">
      <nav className="bg-slate-700 p-3 flex justify-between items-center">
        <p>RafChat</p>

        {user && (
          <div className="flex gap-3">
            <button
              onClick={toggleSidebar}
              className="text-xl hover:text-2xl transition-all duration-200"
            >
              ☰
            </button>
            <button onClick={handleEditProfile} className="border rounded-4xl px-3 py-1 text-l bg-purple-800 hover:bg-purple-900">
              Edit Profile
            </button>

            <button onClick={handleLogout} className="border rounded-4xl px-3 py-1 text-l bg-purple-800 hover:bg-purple-900">
              Logout
            </button>
          </div>
        )}
      </nav>
    
      
      <div
        className={`
          fixed right-0 
          overflow-hidden
          transition-all
          duration-300
          ${
            isSidebarOpen
              ? "md:w-100 w-50"
              : "w-0"
          }
        `}
      >
        <Sidebar />
      </div>

    </div>
  );
};

export default Chat;

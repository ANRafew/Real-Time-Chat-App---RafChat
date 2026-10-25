import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import Chat from "../pages/Chat";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (location.pathname === "/Chat") {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

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
  const handleChat = () => {
    navigate("/Chat");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="">
      <nav className="bg-slate-700 p-3 flex justify-between items-center fixed
    top-0
    left-0
    right-0
    z-50
    h-16
    
    ">
        <button className="flex gap-1 px-2 cursor-pointer" onClick={handleChat}>
          <img src="/LR.png" alt="logo" 
            className="size-6"/>
          RafChat
        </button>

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
export default Navbar;
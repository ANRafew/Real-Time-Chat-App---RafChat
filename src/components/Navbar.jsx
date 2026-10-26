import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const path = location.pathname.toLowerCase();

  setIsSidebarOpen(
    path.startsWith("/chat") 
  );
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
      <nav
        className="
          bg-slate-700
          fixed
          top-0
          left-0
          right-0
          z-50
          h-16
          px-3
          flex
          items-center
          justify-between
        "
      >
        {/* Logo */}
        <button
          className="
            flex
            items-center
            gap-2
            font-bold
            text-lg
            md:text-3xl
            whitespace-nowrap
            cursor-pointer
          "
          onClick={handleChat}
        >
          <img
            src="/LR.png"
            alt="logo"
            className="w-8 h-8 md:w-9 md:h-9"
          />
          <span>RafChat</span>
        </button>

        {user && (
          <div className="flex items-center gap-2 md:gap-3">

            {/* Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="
                text-xl
                md:text-3xl
                hover:text-gray-400
                transition-all
                duration-200
              "
            >
              <i className="fa-solid fa-users-line"></i>
            </button>

            {/* Edit Profile */}
            <button
              onClick={handleEditProfile}
              className="
                border
                rounded-full
                px-2
                md:px-3
                py-1
                text-sm
                md:text-base
                bg-purple-800
                hover:bg-purple-900
              "
            >
              <span className="hidden sm:inline">
                Edit Profile
              </span>

              <span className="sm:hidden">
                <i className="fa-solid fa-user-pen"></i>
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                border
                rounded-full
                px-2
                md:px-3
                py-1
                text-sm
                md:text-base
                bg-purple-800
                hover:bg-purple-900
              "
            >
              
              <div className="">
                <i className="fa-solid fa-right-from-bracket"></i>
              </div>
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
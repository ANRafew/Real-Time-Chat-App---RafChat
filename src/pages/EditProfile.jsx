import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

const EditProfile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setUsername(data.username ?? "");
      }
    };

    loadProfile();
  }, [navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username: username.trim(),
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile saved successfully!");

    navigate("/chat");
  };

  return (
    <>
      <Navbar/>
    
      <div className="text-center bg-sky-800 rounded-3xl md:mx-130 mx-5 my-50 py-8">
        
        <form onSubmit={handleSaveProfile}>
          <h1 className="pb-5 text-3xl font-bold">Edit Profile</h1>
          <div className="p-3">
            <input
              className="border rounded-2xl p-1 md:min-w-80"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
          </div>

          <button
            className="border rounded-4xl px-3 py-1 text-xl bg-purple-800 hover:bg-purple-900"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

const EditProfile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState("");


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
        setCurrentAvatar(data.avatar_url ?? "");
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

    let avatarUrl = null;

    if (avatar) {
      const fileExt = avatar.name
        .split(".")
        .pop();

      const filePath =
        `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(filePath, avatar);

      if (uploadError) {
        console.error(uploadError);

        alert(
          "Upload failed: " +
            uploadError.message
        );

        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = publicUrl;
    }

    const updateData = {
      id: user.id,
      username: username.trim(),
    };

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(updateData);

    setLoading(false);

    if (error) {
      console.error(error);

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
          <div className="flex justify-center mb-4">
            {avatar ? (
              <img
                src={URL.createObjectURL(avatar)}
                alt="New avatar preview"
                className="
                  w-32
                  h-32
                  rounded-full
                  object-cover
                  border-2
                "
              />
            ) : currentAvatar ? (
              <img
                src={currentAvatar}
                alt="Current avatar"
                className="
                  w-32
                  h-32
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  w-32
                  h-32
                  rounded-full
                  bg-slate-600
                  flex
                  items-center
                  justify-center
                  text-4xl
                  font-bold
                "
              >
                {username?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="p-3">
              <label
                className="
                  mb-3
                  border
                  rounded-2xl
                  p-1
                  md:min-w-80
                  min-w-48
                  inline-block
                  cursor-pointer
                  hover:bg-slate-700
                "
              >
                Choose Profile Picture

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setAvatar(e.target.files[0])
                  }
                  className="hidden"
                />
              </label>

              {avatar && (
                <p className="mt-2 text-sm">
                  {avatar.name}
                </p>
              )}
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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

const Profile = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error.message);
        return;
      }

      setProfile(data);
    };

    getProfile();
  }, [id]);

  if (!profile) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <>
      <Navbar/>
      <div className="p-8">
        <div className="flex flex-col items-center gap-4">

          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
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
              "
            >
              {profile.username
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          <h1 className="text-3xl font-bold">
            {profile.username}
          </h1>

          <button
            className="
              px-4
              py-2
              bg-blue-600
              rounded-lg
              hover:bg-blue-700
            "
          >
            Send Message
          </button>

        </div>
      </div>
    </>
  );
};

export default Profile;
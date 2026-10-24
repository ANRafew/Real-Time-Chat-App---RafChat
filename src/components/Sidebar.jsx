import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
        user.username
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  useEffect(() => {
    const getUsers = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUser.id);

      if (error) {
        console.error(error.message);
        return;
      }

      setUsers(data);
    };

    getUsers();
  }, []);

  return (
    <aside className="h-screen sticky top-0 bg-slate-800 p-4">
      <h2 className="text-xl font-bold mb-4">
        People
      </h2>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
        className="
            w-full
            p-2
            rounded-lg
            bg-slate-700
            mb-4
        "
      />

        <div className="flex flex-col gap-2">
        {filteredUsers.map((user) => (
            <div
                key={user.id}
                onClick={() =>
                    navigate(`/Profile/${user.id}`)
                }
                className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-lg
                    hover:bg-slate-600
                    cursor-pointer
                "
                >
                {user.avatar_url ? (
                    <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="
                        w-10
                        h-10
                        rounded-full
                        object-cover
                    "
                    />
                ) : (
                    <div
                    className="
                        w-10
                        h-10
                        rounded-full
                        bg-slate-500
                        flex
                        items-center
                        justify-center
                        text-white
                        font-bold
                    "
                    >
                    {user.username?.charAt(0).toUpperCase()}
                </div>
  )}

  <p>{user.username}</p>
</div>
        ))}
        </div>

    </aside>
  );
};

export default Sidebar;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Chat = () => {

  const [recentChats, setRecentChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRecentChats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      const conversations = new Map();

      for (const message of messages) {
        const otherUserId =
          message.sender_id === user.id
            ? message.receiver_id
            : message.sender_id;

        if (!conversations.has(otherUserId)) {
          conversations.set(otherUserId, message);
        }
      }

      const ids = [...conversations.keys()];

      if (ids.length === 0) {
        setRecentChats([]);
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids);

      const chatList = ids.map((id) => ({
        profile: profiles.find((p) => p.id === id),
        lastMessage: conversations.get(id),
      }));

      setRecentChats(chatList);
    };

    getRecentChats();
  }, []);  
  

  return (
    <>
      <Navbar />

      <div className="mt-18 p-4">
        <h2 className="text-3xl font-bold mb-3">
          Conversations
        </h2>

        {recentChats.map((chat) => (
          <div
            key={chat.profile.id}
            onClick={() =>
              navigate(
                `/conversation/${chat.profile.id}`
              )
            }
            className="
              p-3
              rounded-lg
              mb-2
              cursor-pointer
              hover:bg-slate-600
            "
          >
            <div className="flex items-center gap-3">

              <div className="
                w-10
                h-10
                rounded-full
                bg-slate-500
                flex
                items-center
                justify-center
              ">
                {chat.profile.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <p className="font-semibold">
                  {chat.profile.username}
                </p>

                <p className="text-sm text-slate-400 truncate">
                  {chat.lastMessage.content}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

    </>
  );
};

export default Chat;
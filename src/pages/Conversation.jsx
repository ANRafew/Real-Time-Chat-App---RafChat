import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

import Navbar from "../components/Navbar";

const Conversation = () => {
  const { userId } = useParams();

  const [recipient, setRecipient] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  const loadMessages = async (user) => {
    if (!user || !userId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(error.message);
      return;
    }

    setMessages(data);
  };

  useEffect(() => {
    const setupConversation = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(error.message);
        return;
      }

      setRecipient(data);

      await loadMessages(user);
    };

    setupConversation();
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!currentUser || !userId) return;

    const channel = supabase
      .channel(`conversation-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        async () => {
          await loadMessages(currentUser);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, userId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!currentUser) return;

    const { error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUser.id,
        receiver_id: userId,
        content: message,
        type: "text",
      });

    if (error) {
      console.error(error.message);
      return;
    }

    setMessage("");
  };

  const markMessagesAsSeen = async () => {
    if (!currentUser || !userId) return;

    const { error } = await supabase
      .from("messages")
      .update({ seen: true })
      .eq("sender_id", userId)
      .eq("receiver_id", currentUser.id)
      .eq("seen", false);

    if (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    markMessagesAsSeen();
  }, [currentUser, userId]);

  if (!recipient) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="pt-20 text-center">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      
        {/* Header */}
        <div className="border-b bg-slate-800 p-4 flex items-center gap-3 mt-16
            fixed
            top-0
            left-0
            right-0
            z-50
            h-16
        ">
          <Navbar />
          {recipient.avatar_url ? (
            <img
              src={recipient.avatar_url}
              alt={recipient.username}
              className="
                w-12
                h-12
                rounded-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                w-12
                h-12
                rounded-full
                bg-slate-600
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {recipient.username
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          <h2 className="text-xl font-semibold ">
            {recipient.username}
          </h2>
        </div>
        
      <div className="pt-16 flex flex-col">
        
          <div> 
            <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: "smooth" })} > 
                <i className="fa-solid fa-chevron-down fixed top-35
                    left-0 right-0 z-50 h-16 text-blue-900/30 text-5xl px-4 py-2 hover:text-blue-800/30 transition"></i> 
            </button>
          </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 mt-16 mb-18">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 py-30">
              Start your conversation with{" "}
              {recipient.username}
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender_id === currentUser?.id
                  ? "self-end"
                  : "self-start"
              }
            >
              <div
                className={`
                    p-3
                    rounded-lg
                    max-w-xl
                    ${
                    msg.sender_id === currentUser?.id
                        ? "bg-blue-600"
                        : "bg-slate-700"
                    }
                `}
                >
                {msg.content}
              </div>

              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>
                  {new Date(
                    msg.created_at
                  ).toLocaleTimeString()}
                </span>

                {msg.sender_id === currentUser?.id && (
                  <span className="font-bold">
                    {msg.seen ? "Seen" : "Delivered"}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-slate-800 p-3 mt-4 flex gap-3
            fixed
            bottom-0
            left-0
            right-0
            z-50
            h-16
        ">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="
              flex-1
              p-2
              rounded-lg
              border
            "
          />

          <button
            onClick={handleSendMessage}
            className="
              px-4
              py-2
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
            "
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Conversation;
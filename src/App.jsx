import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Conversation from "./pages/Conversation";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/chat"
            element={<Chat />}
          />
      
          <Route
            path="/conversation/:userId"
            element={<Conversation />}
          />

          <Route
            path="/profile/:id"
            element={<Profile />}
          />

          <Route
            path="/edit-profile"
            element={<EditProfile />}
          />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
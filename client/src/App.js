import "./App.css";
import { Routes, Route } from "react-router-dom";
import SingleStory from "./components/SingleStory/SingleStory";
import Stories from "./components/Stories/Stories";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import LogInForm from "./components/LogInForm/LogInForm";
import CreateStoryForm from "./components/CreateStoryForm/CreateStoryForm";
import EditStoryForm from "./components/EditStoryForm/EditStoryForm";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import CheckAuth from "./components/CheckAuth/CheckAuth";
import PersistLogin from "./components/PersistLogin/PersistLogin";
import UserPage from "./components/UserPage/UserPage";
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        {/*if user is signed in, and tries to access these, redirect them to home*/}
        <Route element={<CheckAuth />}>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LogInForm />} />
        </Route>

        <Route path="/" element={<NavBar />}>
          <Route path="/" element={<Stories />} />
          <Route path="/story/:story_id" element={<SingleStory />} />

          <Route path="/user/:username" element={<UserPage />} />

          {/*Protected routes*/}
          <Route element={<RequireAuth />}>
            <Route path="/write" element={<CreateStoryForm />} />
            <Route path="/edit" element={<EditStoryForm />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

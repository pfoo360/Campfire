import "./App.css";
import { Routes, Route } from "react-router-dom";
import SingleStory from "./components/SingleStory/SingleStory";
import Stories from "./components/Stories/Stories";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import LogInForm from "./components/LogInForm/LogInForm";
import StoryForm from "./components/StoryForm/StoryForm";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import CheckAuth from "./components/CheckAuth/CheckAuth";
import PersistLogin from "./components/PersistLogin/PersistLogin";

function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        {/*if user is signed in, and tries to access these, redirect them to home*/}
        <Route element={<CheckAuth />}>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LogInForm />} />
        </Route>

        <Route path="/" element={<Stories />} />

        {/*Protected routes*/}
        <Route element={<RequireAuth />}>
          <Route path="/write" element={<StoryForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

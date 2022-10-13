import logo from "./logo.svg";
import "./App.css";
import SingleStory from "./components/SingleStory/SingleStory";
import Stories from "./components/Stories/Stories";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import LogInForm from "./components/LogInForm/LogInForm";
import StoryForm from "./components/StoryForm/StoryForm";

function App() {
  return (
    <div className="App">
      <StoryForm />

      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

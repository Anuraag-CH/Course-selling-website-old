import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Signup from "./Signup";
import Appbar from "./Appbar";
import Signin from "./Signin";
import AddCourse from "./AddCourse";

function App() {
  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#eeeeee" }}
    >
      <Appbar></Appbar>
      <Router>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<AddCourse />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

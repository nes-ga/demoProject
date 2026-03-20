import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoardList from "./pages/BoardList";
import BoardDetail from "./pages/BoardDetail";
import PageCreate from "./pages/BoardCreate";
import BoardCreate from "./pages/BoardCreate";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
          <Route path="/create" element={<BoardCreate />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
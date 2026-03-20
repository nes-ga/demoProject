import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import BoardCreate from "./pages/BoardCreate";
import BoardDetail from "./pages/boardDetail";
import BoardList from "./pages/boardList";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<BoardList />} />
                    <Route path="/boards/:id" element={<BoardDetail />} />
                    <Route
                        path="/create"
                        element={
                            <ProtectedRoute>
                                <BoardCreate />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

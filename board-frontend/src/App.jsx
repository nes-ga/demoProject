import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import BoardCreate from "./pages/BoardCreate";
import BoardDetail from "./pages/boardDetail";
import BoardList from "./pages/boardList";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";

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
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/mypage"
                        element={
                            <ProtectedRoute>
                                <MyPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/mypage/password"
                        element={
                            <ProtectedRoute>
                                <ChangePasswordPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

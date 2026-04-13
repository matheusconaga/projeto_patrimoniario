import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../screens/Auth/Login";
import App from "../App";
import DetalhesMobile from "../screens/DetalhesMobile";
import RequireAuth from "./RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "../screens/Auth/Register";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <App />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/detalhes/:id"
                    element={
                        <RequireAuth>
                            <DetalhesMobile />
                        </RequireAuth>
                    }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <ToastContainer autoClose={2000} />
        </BrowserRouter>
    );
}

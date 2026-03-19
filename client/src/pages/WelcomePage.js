import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetch("http://localhost:5000/auth/me", {
            headers: {
                Authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    navigate("/");
                } else {
                    setMessage(data.message);
                }
            });
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md">

                <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                    ✓
                </div>
                <h2 className="text-2xl font-bold text-green-600">{message}</h2>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Authentication Successful
                </h2>

                <p className="text-gray-500 mb-4">
                    Your OTP has been successfully verified.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-semibold">
                        OTP-Based Authentication Web Application
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Developed for Cyseck Company
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        This system ensures secure login using one-time password verification.
                    </p>
                </div>

            </div>
        </div>
    );
}
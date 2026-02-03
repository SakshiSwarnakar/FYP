import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from "../context/AuthContext";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, login } = useAuth();

    const from = location.state?.from || "/dashboard";


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [viewpw, setViewpw] = useState(false)
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true)

        try {
            const status = await login(email, password);

            if (status == 'success') {
                navigate(from, { replace: true });
            }

        } catch (err) {
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Login to Your Account
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type={viewpw ? "text" : "password"}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => setViewpw(!viewpw)} className="absolute cursor-pointer top-9 right-2">
                            {viewpw ? <EyeClosed /> : <Eye />}
                        </button>
                        <div className="text-right">
                            <Link className="underline text-sm text-blue-400" to='/forgotpassword'>
                                Forgot Password.
                            </Link>
                        </div>
                    </div>


                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:scale-105 cursor-pointer transition disabled:bg-blue-300"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-accent hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { redirect, useNavigate } from "react-router";

export default function Register() {
    const navigate = useNavigate()
    const { register } = useAuth();

    const { user } = useAuth()

    if (user) {
        navigate('/profile')
    }



    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        organizationName: "",
        organizationDescription: "",
        organizationType: "",
        organizationPhone: "",
        organizationEmail: "",
        organizationLocation: "",
        organizationLogo: null,
        role: "VOLUNTEER"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("organizationLocation.")) {
            const field = name.split(".")[1];

            setForm((prev) => ({
                ...prev,
                organizationLocation: {
                    ...prev.organizationLocation,
                    [field]: value,
                },
            }));
            return;
        }

        // For normal fields
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await register(form);

            setSuccess("Registration successful! Redirecting...");
            setTimeout(() => {
                setSuccess("")
                navigate('/login');
            }, 1000)

        } catch (err) {
            setError("Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4">
            <div className="w-full max-w-2xl bg-white p-8 mx-auto rounded-2xl shadow-lg">

                <h2 className="text-2xl text-primary font-bold mb-6 text-center">
                    Create an Account
                </h2>



                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Role */}
                    <div>
                        <div className="flex bg-secondary rounded-full p-1 w-64 mx-auto">
                            {/* Organizer */}
                            <button
                                type="button"
                                name="role"
                                value={"ADMIN"}
                                onClick={handleChange}
                                className={`cursor-pointer flex-1 py-2 text-center rounded-full transition-all font-medium ${form.role === "ADMIN" ? "bg-primary text-white" : "text-black"}`}>
                                Organizer
                            </button>

                            {/* Volunteer */}
                            <button
                                type="button"
                                name="role"
                                value={'VOLUNTEER'}
                                onClick={handleChange}
                                className={`cursor-pointer flex-1 py-2 text-center rounded-full transition-all font-medium ${form.role === "VOLUNTEER" ? "bg-primary text-white" : "text-black"}`}>
                                Volunteer
                            </button>
                        </div>
                    </div>

                    {/* Common fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border-border border rounded-lg"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border-border border-border-border border rounded-lg"
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border-border border rounded-lg"
                    />

                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border-border border rounded-lg"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border-border border rounded-lg"
                    />

                    {/* Organizer fields */}
                    {form.role === "ADMIN" && (
                        <div className="space-y-4 border-border border-t pt-4">
                            <input
                                type="text"
                                name="organizationName"
                                placeholder="Organization Name"
                                value={form.organizationName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-border border rounded-lg"
                            />
                            <textarea
                                name="organizationDescription"
                                placeholder="Organization Description"
                                value={form.organizationDescription}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-border border rounded-lg"
                            />
                            <div>

                                <select
                                    name="organizationType"
                                    onChange={handleChange}
                                    class="w-full border-border border rounded-lg px-3 py-2 bg-white"
                                >
                                    <option value="">Select organization type</option>
                                    <option value="NGO">NGO</option>
                                    <option value="Charity">Charity</option>
                                    <option value="Club">Club</option>
                                    <option value="Community">Community</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <input
                                type="text"
                                name="organizationPhone"
                                placeholder="Organization Phone"
                                value={form.organizationPhone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-border border rounded-lg"
                            />
                            <input
                                type="email"
                                name="organizationEmail"
                                placeholder="Organization Email"
                                value={form.organizationEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border-border border rounded-lg"
                            />
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="organizationLocation.address"
                                        onChange={handleChange}
                                        class="w-full border-border border rounded-lg px-3 py-2"
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-1">City</label>
                                    <input
                                        type="text"
                                        name="organizationLocation.city"
                                        onChange={handleChange}
                                        class="w-full border-border border rounded-lg px-3 py-2"
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-1">State</label>
                                    <input
                                        type="text"
                                        name="organizationLocation.state"
                                        onChange={handleChange}
                                        class="w-full border-border border rounded-lg px-3 py-2"
                                        placeholder="Enter state"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-1">Country</label>
                                    <input
                                        type="text"
                                        name="organizationLocation.country"
                                        onChange={handleChange}
                                        class="w-full border-border border rounded-lg px-3 py-2"
                                        placeholder="Enter country"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer primary-btn transition disabled:bg-green-300"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
                )}
            </div>
        </div>
    );
}

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        role: "",
        Dept: "",
        location: "",
        region: "",
        password: "",
        confirm_password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/register", formData);
            alert(response.data.message);
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.error || "Registration failed");
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                    <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                        Register your account
                    </h2>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-xl md:max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="p-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="p-2">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                                User Role
                            </label>
                            <div className="mt-2">
                                <select
                                    name="role"
                                    id="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                >
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Intern">Intern</option>
                                </select>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="p-2">
                            <label htmlFor="Dept" className="block text-sm font-medium text-gray-900">
                                Department
                            </label>
                            <div className="mt-2">
                                <select
                                    name="Dept"
                                    id="Dept"
                                    required
                                    value={formData.Dept}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                >
                                    <option value="">Select Department</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Legal">Legal</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Finance">Finance</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="p-2">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                                Location
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    required
                                    placeholder="e.g., NYC Office, Remote - India"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Region */}
                        <div className="p-2">
                            <label htmlFor="region" className="block text-sm font-medium text-gray-900">
                                Region
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="region"
                                    id="region"
                                    required
                                    autoComplete="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="p-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                    autoComplete="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="p-2">
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="confirm_password"
                                    id="confirm_password"
                                    required
                                    autoComplete="current-password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="col-span-1 md:col-span-2">
                            <button
                                type="submit"
                                className="w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

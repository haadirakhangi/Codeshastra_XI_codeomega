export default function Register() {
    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                    <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                        Register your account
                    </h2>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-xl md:max-w-2xl">
                    <form className="" action="#" method="POST">
                        {/* Column 1 Inputs */}
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
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="p-2">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                                User Role
                            </label>
                            <div className="mt-2">
                                <select
                                    name="role"
                                    id="role"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                >
                                    <option value="">Select Role</option>
                                    <option value="NA">Admin</option>
                                    <option value="EU">Manager</option>
                                    <option value="APAC">Intern</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-2">
                            <label htmlFor="Dept" className="block text-sm font-medium text-gray-900">
                                Department
                            </label>
                            <div className="mt-2">
                                <select
                                    name="Dept"
                                    id="Dept"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                >
                                    <option value="">Select Department</option>
                                    <option value="NA">Sales</option>
                                    <option value="EU">Legal</option>
                                    <option value="APAC">Operations</option>
                                    <option value="APAC">Finance</option>
                                    <option value="APAC">HR</option>
                                </select>
                            </div>
                        </div>


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
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

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
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

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
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="p-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                              Confirm  Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="confirm_password"
                                    id="confirm_password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Full-width submit button */}
                        <div className="col-span-1 md:col-span-2">
                            <button
                                type="submit"
                                className="w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

export default function Register() {
    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
                    <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Register your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input type="email" name="email" id="email" autoComplete="email" required
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="userRole" className="block text-sm font-medium text-gray-900">User Role</label>
                            <div className="mt-2">
                                <input type="text" name="userRole" id="userRole" required
                                       placeholder="e.g., Admin, Manager"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-900">Department</label>
                            <div className="mt-2">
                                <input type="text" name="department" id="department"
                                       placeholder="e.g., IT, Finance"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="employeeStatus" className="block text-sm font-medium text-gray-900">Employee Status</label>
                            <div className="mt-2">
                                <input type="text" name="employeeStatus" id="employeeStatus" required
                                       placeholder="e.g., Full-time, Contract"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="timeInPosition" className="block text-sm font-medium text-gray-900">Time in Position</label>
                            <div className="mt-2">
                                <input type="text" name="timeInPosition" id="timeInPosition" required
                                       placeholder="e.g., 2 years"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-900">Location</label>
                            <div className="mt-2">
                                <input type="text" name="location" id="location" required
                                       placeholder="e.g., NYC Office, Remote - India"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="deviceType" className="block text-sm font-medium text-gray-900">Device Type</label>
                            <div className="mt-2">
                                <input type="text" name="deviceType" id="deviceType"
                                       placeholder="e.g., Laptop, Mobile"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="lastTraining" className="block text-sm font-medium text-gray-900">Last Security Training</label>
                            <div className="mt-2">
                                <input type="date" name="lastTraining" id="lastTraining"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="joinDate" className="block text-sm font-medium text-gray-900">Employee Join Date</label>
                            <div className="mt-2">
                                <input type="date" name="joinDate" id="joinDate"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-900">Region</label>
                            <div className="mt-2">
                                <select name="region" id="region" required
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm">
                                    <option value="">Select Region</option>
                                    <option value="NA">NA</option>
                                    <option value="EU">EU</option>
                                    <option value="APAC">APAC</option>
                                    <option value="LATAM">LATAM</option>
                                    <option value="Unknown">Unknown</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                            <div className="mt-2">
                                <input type="password" name="password" id="password" required
                                       autoComplete="current-password"
                                       className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

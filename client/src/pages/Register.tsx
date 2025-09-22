import { FaUser } from 'react-icons/fa'
import React, { useState } from 'react'
import { RoleType, type RegisterUserDTO } from '../types'
import useRegister from '../hooks/useRegister'

const Register = () => {
    const [formData, setFormData] = useState<RegisterUserDTO>({
        name: '',
        email: '',
        password: '',
        role: RoleType.USER
    });

    const { isPending, registerMutate } = useRegister();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        registerMutate(formData);
    }
    
    return (
        <div className='flex-grow flex justify-center items-center'>
            <form onSubmit={handleSubmit}>
                <div className="card bg-base-300 text-base-content w-96 card-lg my-5">
                    <div className="card-body">
                        <h2 className="card-title text-3xl">Register</h2>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Name:</legend>
                            <label className="input validator">
                                <FaUser className='text-gray-500'/>
                                <input type="text" placeholder="Your Name" required value={formData.name} 
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
                            </label>
                            <p className="validator-hint hidden">
                                Name is required
                            </p>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Email:</legend>
                            <label className="input validator">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input type="email" placeholder="email@example.com" required value={formData.email} 
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
                            </label>
                            <p className="validator-hint hidden">
                                Enter valid email address
                            </p>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Password:</legend>
                            <label className="input validator">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="password"
                                    required
                                    placeholder='Password'
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                    value={formData.password}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be at least 8 characters, including
                                <br />At least one number
                                <br />At least one lowercase letter
                                <br />At least one uppercase letter
                            </p>
                        </fieldset>
                        <div className='card-actions justify-end'>
                            <button className="btn btn-info" disabled={isPending}>
                                {isPending && <span className='loading loading-spinner'></span>}
                                Register
                            </button>
                        </div>
                        <div className="card-actions justify-center text-sm text-center">
                            <p>Already have an account? <a href="/login" className="link link-secondary">Login</a></p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register
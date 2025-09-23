import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { message } from "antd";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [plan, setPlan] = useState("monthly");
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            return message.error('Password and confirm password should be same')
        }
        const data = {
            name,
            email,
            password,
            subscription: true,
            plan_price: plan === "monthly" ? 2 : 18,
        }
        try {
            const res = await register(data);
            message.success('Registered Successfully');
            navigate('/login');

        } catch (error) {
            console.log('error---', error);
            message.error('Error registering')
        }
    }
    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label>Name</label>
                    <input className="form-control" value={name}
                        onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control" type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input className="form-control" type="password" value={password}
                        onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Confirm Password</label>
                    <input className="form-control" type="password" value={confirm}
                        onChange={(e) => setConfirm(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Subscription</label>
                    <div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio"
                                checked={plan === "monthly"} onChange={() => setPlan("monthly")} />
                            <label className="form-check-label">
                                $2 / month <i>(Save up to 2 weather)</i>
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio"
                                checked={plan === "yearly"} onChange={() => setPlan("yearly")} />
                            <label className="form-check-label">
                                $18 / year <i>(Unlimited weather)</i>
                            </label>
                        </div>
                    </div>
                </div>
                <button className="btn btn-success w-100" type="submit">Register</button>
            </form>
            <p className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>  
        </div>
    )
}

export default RegisterPage

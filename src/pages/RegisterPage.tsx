import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { message } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
        <div className='d-flex justify-content-center align-items-center vh-100' style={{  background: 'linear-gradient(135deg, #6fb1fc, #4364f7)'}} >
      <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className='text-center mb-4'>Register</h2>
        <hr />
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
            <label htmlFor='email'>Email</label>
          </div>
          <div className="form-floating mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <label htmlFor='password'>Password</label>
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="form-floating mb-3 position-relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="form-control"
              id="confirm-p"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              required
            />
            <label htmlFor='confirm-p'>Confirm Password</label>
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="mb-3" style={{cursor: "pointer"}}>
            <label className="form-label d-block fw-semibold">Subscription</label>
            <div className="form-check">
              <input
                className="form-check-input"
                id="subscription-monthly"
                type="radio"
                checked={plan === "monthly"}
                onChange={() => setPlan("monthly")}
              />
              <label className="form-check-label" htmlFor="subscription-monthly">
                $2 / month <i>(Save up to 2 weather)</i>
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                id="subscription-yearly"
                type="radio"
                checked={plan === "yearly"}
                onChange={() => setPlan("yearly")}
              />
              <label className="form-check-label" htmlFor="subscription-yearly">
                $18 / year <i>(Unlimited weather)</i>
              </label>
            </div>
          </div>

          <button className="btn btn-primary w-100 my-4" type="submit">Register</button>
        </form>

        <p className="text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
    )
}

export default RegisterPage

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { setAuth } from '../utils/storage';
import { message } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = ({ setIsAuthenticated }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({ email, password });  
            setAuth(res.data.token, res.data.userId, res.data.plan_price);
            setIsAuthenticated(true);
            navigate('/');
            message.success('Login successfully');
        } catch (error) {
            message.error("Invalid Credentials");
            console.log('---error---', error);
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: "#f5f5f5" }}>
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className='text-center mb-4'>🌦️ Weather App Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className='form-label fw-semibold'>Email</label>
                        <input
                            id="email"
                            name="email"
                            className='form-control'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="password" className='form-label fw-semibold'>Password</label>
                        <input
                            id="password"
                            name="password"
                            className='form-control'
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                right: '10px',
                                cursor: 'pointer',
                                color: '#6c757d'
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button className="btn btn-primary w-100 mb-3" type="submit">Login</button>
                </form>

                <p className="text-center">
                    Don’t have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage;

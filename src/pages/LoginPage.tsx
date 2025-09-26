import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { setAuth } from '../utils/storage';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../interfaces/user'

const LoginPage = ({ setIsAuthenticated }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email is invalid")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(4, "Password must be at least 6 characters"),
    });

    const handleSubmit = async (values: any) => {
        try {
            const data: loginUser = {
                email: values.email,
                password: values.password
            }
            const res = await login(data);
            setAuth(res.data.accessToken, res.data.refreshToken, res.data.userData);
            setIsAuthenticated(true);
            navigate('/');
            toast.success('Login successfully');
        } catch (error) {
            toast.error("Invalid Credentials");
            console.log('---error--', error);
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center vh-100' style={{ background: 'linear-gradient(135deg, #6fb1fc, #4364f7)', }}>
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className='text-center mb-4'>Login</h2>
                <hr />
                <Formik initialValues={{ email: '', password: '' }} onSubmit={handleSubmit} validationSchema={validationSchema} >
                    {({ errors, touched, isValid, dirty }) => (
                        <Form>
                            <div className="mb-3">
                                <label htmlFor="email" className='form-label fw-semibold'>Email *</label>
                                <Field
                                    id="email"
                                    name="email"
                                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                    type='email'
                                    required
                                    placeholder="name@example.com"
                                />
                                <ErrorMessage name="email" component="div" className="invalid-feedback d-block" />
                            </div>
                            <div className="mb-3 position-relative">
                                <label htmlFor="password" className='form-label fw-semibold'>Password *</label>
                                <Field
                                    id="password"
                                    name="password"
                                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                    type={showPassword ? "text" : "password"}
                                    required
                                />
                                {!(errors.password && touched.password) && (
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
                                )}
                                <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
                            </div>
                            <button className="btn btn-primary w-100 my-3" type="submit" disabled={!(isValid && dirty)}>Login</button>
                        </Form>
                    )}
                </Formik>
                <p className="text-center mt-2">
                    Don’t have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage;

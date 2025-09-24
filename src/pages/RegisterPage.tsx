import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [plan, setPlan] = useState("monthly");
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: Yup.string()
      .email("Email is invalid")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirm: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref('password')], "Passwords do not match"),
  });

  const handleSubmit = async (values: any) => {
    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
      subscription: true,
      plan_price: plan === "monthly" ? 2 : 18,
    }
    try {
      const res = await register(data);
      toast.success('Registered Successfully');
      navigate('/login');
    } catch (error) {
      console.log('error---', error);
      toast.error('Error registering');
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ background: 'linear-gradient(135deg, #6fb1fc, #4364f7)' }}>
      <div className="card p-4 shadow-lg h-auto" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className='text-center'>Register</h2>
        <hr />

        <Formik
          initialValues={{ name: '', email: '', password: '', confirm: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form className="mt-3">

              <div className="form-floating mb-3">
                <Field
                  type="text"
                  name="name"
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  id="name"
                  placeholder="Enter name"
                  required
                />
                <label htmlFor="name">Name *</label>
                <ErrorMessage name="name" component="div" className="invalid-feedback d-block" />
              </div>

              <div className="form-floating mb-3">
                <Field
                  type="email"
                  name="email"
                  className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                  id="email"
                  placeholder="Enter email"
                />
                <label htmlFor="email">Email *</label>
                <ErrorMessage name="email" component="div" className="invalid-feedback d-block" />
              </div>

              <div className="form-floating mb-3 position-relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  id="password"
                  placeholder="Enter password"
                />
                <label htmlFor="password">Password *</label>
                {!(errors.password && touched.password) && (
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
                )}
                <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
              </div>

              <div className="form-floating mb-3 position-relative">
                <Field
                  type={showConfirm ? "text" : "password"}
                  name="confirm"
                  className={`form-control ${errors.confirm && touched.confirm ? 'is-invalid' : ''}`}
                  id="confirm-p"
                  placeholder="Confirm password"
                />
                <label htmlFor="confirm-p">Confirm Password *</label>
                {!(errors.password && touched.password) && (
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
                )}
                <ErrorMessage name="confirm" component="div" className="invalid-feedback d-block" />
              </div>

              <div className="mb-3" style={{ cursor: "pointer" }}>
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

              <button className="btn btn-primary w-100 my-4" type="submit" disabled={!(dirty && isValid)}  >Register</button>
            </Form>
          )}
        </Formik>

        <p className="text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage

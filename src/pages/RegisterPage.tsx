import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createUser } from '../interfaces/user'
import { FaRegRegistered } from "react-icons/fa";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    try {
      let data: createUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        subscription: values.plan ? true : false,
        plan_price: (values.plan === "monthly") ? 2 : ((values.plan === "yearly") ? 18 : 0),
      }
      if (values.image) {
        data['image'] = values.image;
      }
      //  console.log('data----------', data, data.image);

      const res = await register(data);
      toast.success('Registered Successfully');
      navigate('/login');
    } catch (error) {
      console.log('error---', error);
      toast.error('Error registering');
    }
  }

  // handle image upload and convert to Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue('image', reader.result); // store Base64 string in Formik
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center' style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #6fb1fc, #4364f7)",
      overflowY: "auto",
      padding: "10px"
    }}
    >
      <div className="card p-3 shadow-lg h-auto" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className='text-center'><FaRegRegistered />egister</h2>
        <hr />

        <Formik
          initialValues={{ name: '', email: '', password: '', confirm: '', plan: '', image: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isValid, dirty, values, setFieldValue }) => (
            <Form className="mt-3">

              {/* New Image Upload Field */}
              {previewImage && (
                <div
                  className="mb-2 d-flex flex-column align-items-center"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  <div style={{ width: '100px', height: '100px', position: 'relative' }} >
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                    />
                    {/* Cancel button */}
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null); // remove preview
                        setFieldValue('image', ''); // remove from Formik
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''; // reset file input
                        }
                      }}
                      style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', lineHeight: '18px', padding: 0, }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

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
                    checked={values.plan === "monthly"}
                    onChange={() => setFieldValue("plan", "monthly")}
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
                    checked={values.plan === "yearly"}
                    onChange={() => setFieldValue("plan", "yearly")}
                  />
                  <label className="form-check-label" htmlFor="subscription-yearly">
                    $18 / year <i>(Unlimited weather)</i>
                  </label>
                </div>
              </div>

              {/* New Image Upload Field */}
              <div className="">
                <label htmlFor="image" className="form-label fw-semibold">Profile Image</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="form-control"
                  ref={fileInputRef}
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
              </div>

              <div className='d-flex flex-column align-items-center' style={{ cursor: "pointer" }}>
                <button className="btn btn-primary w-75 my-4" type="submit" disabled={!(dirty && isValid)}  ><b>Save</b></button>
              </div>
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

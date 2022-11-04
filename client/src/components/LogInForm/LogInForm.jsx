import React from "react";
import { useFormik } from "formik";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LogInFormCSS from "./LogInForm.module.css";

function LogInForm() {
  const LOGIN_URL = "/api/v1/auth/login";

  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  //if being sent to /login from /edit, we send the updating story to /login
  //we need to pass the same updating story on redirect to /edit
  const story = location.state?.from?.state?.story;

  const initialValues = {
    username: "",
    password: "",
  };

  const validate = (values) => {
    let errors = {};

    if (!values.username) {
      errors.username = "Required";
    } else if (!/^[a-zA-Z0-9_-]{5,13}$/i.test(values.username)) {
      errors.username = "Invalid username format";
    }

    if (!values.password) {
      errors.password = "Required";
    } else if (!/^.{6,15}$/i.test(values.password)) {
      errors.password = "Invalid password format";
    }

    return errors;
  };

  const onSubmit = (values, { setSubmitting, setErrors }) => {
    const submit = async () => {
      try {
        const response = await axios.post(LOGIN_URL, values, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        //console.log(response);
        setSubmitting(true);
        const accessToken = response?.data?.accessToken;
        const userInfo = response?.data?.userInfo;
        setAuth({ userInfo, accessToken });
        navigate(from, { state: { story }, replace: true });
      } catch (error) {
        if (!error?.response) {
          setErrors({ loginError: "No server response" });
        } else if (error.response?.status === 401) {
          setErrors({ loginError: "Invalid username/password" });
        } else if (error.response?.status === 400) {
          setErrors({
            loginError: "Username and password is required",
          });
        } else {
          setErrors({ loginError: "Log in failed" });
        }
        setSubmitting(false);
      }
    };
    submit();
  };

  const formik = useFormik({ initialValues, validate, onSubmit });

  return (
    <div className={LogInFormCSS.Container}>
      <section className={LogInFormCSS.LogIn}>
        <h1 className={LogInFormCSS.LogIn_header}>Log In</h1>
        {formik.errors.loginError && (
          <p className={LogInFormCSS.LogInError_paragraph}>
            {formik.errors.loginError}
          </p>
        )}
        <form
          onSubmit={formik.handleSubmit}
          className={LogInFormCSS.LogIn_form}
        >
          <div className={LogInFormCSS.LogInField}>
            <label htmlFor="username" className={LogInFormCSS.LogInField_label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              required
              className={LogInFormCSS.LogInField_input}
            />
            {formik.touched.username && formik.errors.username && (
              <p className={LogInFormCSS.LogInField_paragraph}>
                {formik.errors.username}
              </p>
            )}
          </div>

          <div className={LogInFormCSS.LogInField}>
            <label htmlFor="password" className={LogInFormCSS.LogInField_label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              required
              className={LogInFormCSS.LogInField_input}
            />
            {formik.touched.password && formik.errors.password && (
              <p className={LogInFormCSS.LogInField_paragraph}>
                {formik.errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`${LogInFormCSS.LogIn_button} ${
              formik.isSubmitting ? LogInFormCSS.LogIn_button__disabled : ""
            }`}
          >
            Log In
          </button>
        </form>
        <p className={LogInFormCSS.LogInRedirect}>
          Need an account? <br />{" "}
          <Link to="/register" className={LogInFormCSS.LogInRedirect_link}>
            Sign Up
          </Link>
        </p>
      </section>
    </div>
  );
}

export default LogInForm;

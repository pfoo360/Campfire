import React, { useContext } from "react";
import { useFormik } from "formik";
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";

function LogInForm() {
  const LOGIN_URL = "/api/v1/auth/login";

  const { setAuth } = useContext(AuthContext);

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
        console.log(response);
        const accessToken = response?.data?.accessToken;
        const userInfo = response?.data?.userInfo;
        setAuth({ userInfo, accessToken });
        setSubmitting(true);
      } catch (error) {
        console.log(error);
        if (!error?.response) {
          setErrors({ loginError: "No server response" });
        } else if (error.response?.status === 401) {
          setErrors({ loginError: "Invalid username/password" });
        } else if (error.response?.status === 400) {
          setErrors({
            loginError: "Username and password is required",
          });
        } else {
          setErrors({ loginError: "Login failed" });
        }
        setSubmitting(false);
      }
    };
    submit();
  };

  const formik = useFormik({ initialValues, validate, onSubmit });

  return (
    <section>
      <h1>Log In</h1>
      {formik.errors.loginError && <p>{formik.errors.loginError}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            required
          />
          {formik.touched.username && formik.errors.username && (
            <p>{formik.errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            required
          />
          {formik.touched.password && formik.errors.password && (
            <p>{formik.errors.password}</p>
          )}
        </div>
        <button type="submit" disabled={formik.isSubmitting}>
          Log In
        </button>
      </form>
      <p>
        Need an account? <br /> <span>Sign Up</span>
      </p>
    </section>
  );
}

export default LogInForm;

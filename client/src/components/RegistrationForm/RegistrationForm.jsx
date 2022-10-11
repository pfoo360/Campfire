import React from "react";
import { useFormik } from "formik";

const initialValues = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  icon: "",
};

const onSubmit = (values) => {
  console.log("submit", values);
};

const validate = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.username) {
    errors.username = "Required";
  } else if (!/^[a-zA-Z0-9._-]{5,13}$/i.test(values.username)) {
    errors.username = "Invalid username format";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (!/^.{6,15}$/i.test(values.password)) {
    errors.password = "Invalid password format";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Required";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (values.icon !== "" && !/^[0-4]{1}$/.test(values.icon)) {
    errors.icon = "Invalid value";
  }

  return errors;
};

const RegistrationForm = () => {
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  //console.log(formik.values)
  //console.log(formik.errors);
  console.log(formik.touched);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div>{formik.errors.email}</div>
        )}

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <div>{formik.errors.username}</div>
        )}

        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div>{formik.errors.password}</div>
        )}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="text"
          id="confirmPassword"
          name="confirmPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div>{formik.errors.confirmPassword}</div>
        )}

        <label htmlFor="icon">Choose an icon</label>
        <input
          type="text"
          id="icon"
          name="icon"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.icon}
        />
        {formik.touched.icon && formik.errors.icon && (
          <div>{formik.errors.icon}</div>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegistrationForm;

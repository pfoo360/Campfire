import React from "react";
import { useFormik } from "formik";

function LogInForm() {
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

  const onSubmit = (values, onSubmitProps) => {
    //e.preventDefault();
    console.log(values);
    console.log("osp", onSubmitProps);
    onSubmitProps.setSubmitting(false);
    onSubmitProps.setErrors({ loginError: "hello" });
  };

  const formik = useFormik({ initialValues, validate, onSubmit });

  console.log("formik", formik);
  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.errors.loginError && <div>{formik.errors.loginError}</div>}
      <div>
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
      </div>

      <div>
        <label htmlFor="password"></label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div>{formik.errors.password}</div>
        )}
      </div>
      <button type="submit" disabled={formik.isSubmitting}>
        Log in
      </button>
    </form>
  );
}

export default LogInForm;

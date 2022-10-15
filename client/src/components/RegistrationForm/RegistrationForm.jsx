import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "../../api/axios";

const RegistrationForm = () => {
  const REGISTRATION_URL = "/api/v1/user";

  const [registrationSuccess, setRegistrationSuccess] = useState("");

  const options = [
    { key: "Select an icon", value: "" },
    { key: "💎 Crystal Lake", value: 1 },
    { key: "👩🏻 Chippewa", value: 2 },
    { key: "🎙️ Rock", value: 3 },
    { key: "👯 Walden", value: 4 },
  ];

  const initialValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    icon: "",
  };

  const validate = (values) => {
    let errors = {};

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email format";
    }

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

    if (!values.confirmPassword) {
      errors.confirmPassword = "Required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords must match";
    }

    // if (!values.icon) {
    //   errors.icon = "Required";
    // } else
    if (values.icon !== "" && !/^[1-4]{1}$/.test(values.icon)) {
      errors.icon = "Invalid value";
    }

    return errors;
  };

  const onSubmit = (values, onSubmitProps) => {
    const submit = async () => {
      try {
        const response = await axios.post(REGISTRATION_URL, values, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        console.log(response);
        setRegistrationSuccess("Registration successful");
        onSubmitProps.resetForm();
        onSubmitProps.setSubmitting(true);
        //to do: navigate to login page since registration was successful
      } catch (error) {
        if (!error?.response) {
          onSubmitProps.setErrors({ registrationError: "No server response" });
        } else if (error.response?.status === 409) {
          onSubmitProps.setErrors({
            registrationError:
              error.response?.data?.message ||
              "Username and/or email already in use",
          });
        } else if (error.response?.status === 400) {
          onSubmitProps.setErrors({
            registrationError:
              error.response?.data?.message ||
              "Missing email, username, or password",
          });
        } else {
          onSubmitProps.setErrors({
            registrationError: "Registration failed",
          });
        }
        console.log(error);
        onSubmitProps.setSubmitting(false);
      }
    };
    submit();
  };

  return (
    <section>
      <h1>Register</h1>
      {registrationSuccess && <p>{registrationSuccess}</p>}
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form>
              {formik.errors.registrationError && (
                <p>{formik.errors.registrationError}</p>
              )}
              <div>
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </div>

              <div>
                <label htmlFor="username">Username</label>
                <Field type="text" id="username" name="username" />
                <ErrorMessage name="username" component="div" />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                />
                <ErrorMessage name="confirmPassword" component="div" />
              </div>

              <div>
                <label htmlFor="icon">Choose an icon</label>
                <Field as="select" id="icon" name="icon">
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.key}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="icon" component="div" />
              </div>

              <button type="submit" disabled={formik.isSubmitting}>
                Sign Up
              </button>
            </Form>
          );
        }}
      </Formik>
      <p>
        Already registered? <br />
        <span>Sign In</span>
      </p>
    </section>
  );
};

export default RegistrationForm;

//crystal lake💎, chippewa(adams family) walden(family trap)👯♊, krusty🤡, camp rock, north star🌟
//🌄🌅🏕️🏞️
//values.icon !== "" &&
// if (
//   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) ||
//   !/^[a-zA-Z0-9_-]{5,13}$/i.test(values.username) ||
//   !/^.{6,15}$/i.test(values.password) ||
//   values.confirmPassword !== values.password ||
//   (values.icon !== "" && !/^[1-4]{1}$/.test(values.icon))
// ) {
//   onSubmitProps.setSubmitting(false);
//   return;
// }

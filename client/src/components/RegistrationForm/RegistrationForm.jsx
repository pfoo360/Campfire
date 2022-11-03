import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import RegistrationFormCSS from "./RegistrationForm.module.css";

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
    <div className={RegistrationFormCSS.Container}>
      <section className={RegistrationFormCSS.Registration}>
        <h1 className={RegistrationFormCSS.Registration_header}>Register</h1>
        {registrationSuccess && <p>{registrationSuccess}</p>}
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form className={RegistrationFormCSS.Registration_form}>
                {formik.errors.registrationError && (
                  <p>{formik.errors.registrationError}</p>
                )}
                <div className={RegistrationFormCSS.Registration_field}>
                  <label
                    htmlFor="email"
                    className={RegistrationFormCSS.Registration_label}
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className={RegistrationFormCSS.Registration_input}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className={RegistrationFormCSS.Registration_error}
                  />
                </div>

                <div className={RegistrationFormCSS.Registration_field}>
                  <label
                    htmlFor="username"
                    className={RegistrationFormCSS.Registration_label}
                  >
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className={RegistrationFormCSS.Registration_input}
                  />
                  <ErrorMessage
                    name="username"
                    component="p"
                    className={RegistrationFormCSS.Registration_error}
                  />
                </div>

                <div className={RegistrationFormCSS.Registration_field}>
                  <label
                    htmlFor="password"
                    className={RegistrationFormCSS.Registration_label}
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className={RegistrationFormCSS.Registration_input}
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className={RegistrationFormCSS.Registration_error}
                  />
                </div>

                <div className={RegistrationFormCSS.Registration_field}>
                  <label
                    htmlFor="confirmPassword"
                    className={RegistrationFormCSS.Registration_label}
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={RegistrationFormCSS.Registration_input}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className={RegistrationFormCSS.Registration_error}
                  />
                </div>

                <div className={RegistrationFormCSS.Registration_field}>
                  <label
                    htmlFor="icon"
                    className={RegistrationFormCSS.Registration_label}
                  >
                    Choose an icon
                  </label>
                  <Field
                    as="select"
                    id="icon"
                    name="icon"
                    className={RegistrationFormCSS.Registration_input}
                  >
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.key}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="icon"
                    component="p"
                    className={RegistrationFormCSS.Registration_error}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className={RegistrationFormCSS.Registration_button}
                >
                  Sign Up
                </button>
              </Form>
            );
          }}
        </Formik>
        <p className={RegistrationFormCSS.RegistrationRedirect}>
          Already registered? <br />
          <Link
            to="/login"
            className={RegistrationFormCSS.RegistrationRedirect_link}
          >
            Sign In
          </Link>
        </p>
      </section>
    </div>
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

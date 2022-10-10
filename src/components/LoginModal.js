import React from "react";
import "./LoginModal.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function LoginModal() {
  const [formValue, setFormValue] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({})
  const [submit, setSubmit] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(validateForm(formValue))
    setSubmit(true);

  }

  const handleValidation = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value })
  }

  const validateForm = (value) => {
    let errors = {}
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!value.email) {
      errors.email = "Please enter email"
    }
    else if (!emailRegex.test(value.email)) {
      errors.email = "Please enter valid email"
    }
    if (!value.password) {
      errors.password = "Please enter a valid password"
    }

    return errors;
  }

  function HideModal() {
    const hiddenModal = document.querySelector(".modal");
    hiddenModal.classList.remove("active-modal");
  }
  function RemoveMenu() {
    const hiddenMenu = document.querySelector(".menu");
    hiddenMenu.classList.remove("active");
  }

  return (
    <article className="modal">
      <section className="modal-main">
        <button
          className="close-modal-btn"
          type="button"
          onClick={() => {
            HideModal();
            RemoveMenu();
          }}
        >
          X
        </button>
        <section className="modal-content">
          <h2>Log in</h2>
          <form className="modal-content" onSubmit={handleSubmit}>
            <input onChange={handleValidation} value={formValue.email} name="email" type="text" placeholder="Email"></input>
            <span className="login-input-err">{formError.email}</span>
            <input onChange={handleValidation} value={formValue.password} name="password" type="password" placeholder="Password"></input>
            <span className="login-input-err">{formError.password}</span>
            <section className="login-and-signup">
              <Link
                to="/register"
                className="modal-signup-btn"
                onClick={() => {
                  HideModal();
                  RemoveMenu();
                }}
              >
                Sign up
              </Link>
              <button type="submit" className="modal-login-btn">Log in</button>

            </section>
          </form>
          <section className="modal-extras">
            <Link
              to="/password-recovery"
              className="modal-forgot-password"
              onClick={() => {
                HideModal();
                RemoveMenu();
                // ShowMenu();
              }}
            >
              Forgot password?
            </Link>
          </section>
        </section>
      </section>
    </article>
  );
}

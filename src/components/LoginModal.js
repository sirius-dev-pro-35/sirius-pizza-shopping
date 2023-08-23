import React, { useEffect, useState } from "react";
import "./loginModal.css";
import LinkButton from "./Button";
import { useNavigate } from "react-router-dom";
import validateForm from "./validateForm";


const LoginModal = ({ setCurrentUser, setLoginModalWindow, setValidLogin, loginModalWindow, hideMenu, validLogin, getUser }) => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({});
  const [submit, setSubmit] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const validate = validateForm("login");

  const getUsers = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_USERS_URL);
      const body = await response.json();
      return body.data;
    }
    catch (err) {
      console.log(err.message)
    }
  }


  const handleValidation = (e) => {

    const { name, value } = e.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };

  const hideLoginModal = () => {
    setLoginModalWindow(false);
    setFormValue({ email: '', password: '' });
    setFormError({});
    setSubmit(false);
  }

  const handleLogin = async (e) => {
    setVerificationError('');
    e.preventDefault();
    setFormError(validate(formValue));
    if (Object.keys(validate(formValue)).length > 0) {
      return;
    }
    else {
      const existingUsers = await getUsers(formValue.email.toLowerCase());
      const targetUser = existingUsers.filter((u) => u.email === formValue.email.toLowerCase());
      const targetPass = existingUsers.filter((u) => u.password === formValue.password);
      if (targetUser.length === 0) {
        setSubmit(false);
        setFormValue({ email: '', password: '' });
        setFormError({})
        setVerificationError("Such user doesn't exist");
        return;
      }
      else if (targetUser.length > 0 && targetPass.length === 0) {
        setSubmit(false);
        setFormValue({ email: '', password: '' });
        setFormError({});
        setVerificationError("Wrong password");
        return;
      }
      else {
        getUser(targetUser[0].id);
        hideLoginModal();
        setFormValue({ email: '', password: '' });
        setFormError({});
        setVerificationError("");
        setValidLogin(true);
        navigate('/menu');
      }
    }
  };


  return (
    <article className={`modal ${loginModalWindow ? 'active-modal' : null}`}>
      <section className="modal-main">
        <button
          className="close-modal-btn"
          type="button"
          onClick={() => {
            hideLoginModal();

          }}
        >
          X
        </button>
        <section className="modal-content">
          <h2>Log in</h2>
          <form className="modal-content" onSubmit={handleLogin}>
            {verificationError.length === 0 ? null : <p className="login-input-err">{verificationError}</p>}
            <input onChange={handleValidation} value={formValue.email} name="email" type="text" placeholder="Email" />
            <span className="login-input-err">{formError.email}</span>
            <input onChange={handleValidation} value={formValue.password} name="password" type="password" autoComplete="true" placeholder="Password" />
            <span className="login-input-err">{formError.password}</span>
            {submit && Object.keys(formError).length === 0 && !validLogin ?
              <p className="login-input-err">We couldn't find an account. Try another credentials</p> :
              null}
            <section className="login-and-signup">
              <LinkButton
                onClick={() => {
                  hideLoginModal();
                  hideMenu();
                }}
                to="/register"
                className="modal-signup-btn"
              >
                Sign up
              </LinkButton>
              <button type="submit" className="modal-login-btn">Log in</button>
            </section>
          </form>
        </section>
      </section>
    </article>
  );
}

export default LoginModal;
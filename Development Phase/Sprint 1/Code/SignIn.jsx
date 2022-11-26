import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Joi from "joi";
import toast from "react-hot-toast";
import jwtDecode from "jwt-decode";
import signInImg from "../assets/img1.jpg";

const SignIn = () => {
  const { userState, googleSignIn } = UserAuth();

  const [user, setUser] = userState;

  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();

  const signInEmailRef = React.createRef();
  const signInPasswordRef = React.createRef();

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = signInEmailRef.current.value;
    const password = signInPasswordRef.current.value;
    console.log({ email, password });

    // VALIDATION
    const emailSchema = Joi.object({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
    });
    const passwordSchema = Joi.object({
      password: Joi.string().min(8).max(20).required(),
    });

    const emailErr = emailSchema.validate({ email }).error;
    const passwordErr = passwordSchema.validate({ password }).error;

    if (emailErr && emailErr.message) {
      setEmailError("email" + emailErr.message.slice(7));
    } else {
      setEmailError(null);
    }
    if (passwordErr && passwordErr.message) {
      setPasswordError("password" + passwordErr.message.slice(10));
    } else {
      setPasswordError(null);
    }

    if (!emailErr && !passwordErr) {
      await axios
        .post("http://localhost:8000/auth/sign-in", { email, password })
        .then((res) => {
          sessionStorage.setItem("token", res.data);
          console.log(res.data);
          setUser(jwtDecode(res.data));
          toast.success(`Welcome ${jwtDecode(res.data).username}`);
          navigate("/");
        })
        .catch((err) => {
          console.log(err.response.data);
          if (err.response.data === "Invalid Password") {
            setPasswordError(err.response.data);
          } else {
            setEmailError(err.response.data);
          }
        });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "56px",
        // border: "5px solid black",
      }}
    >
      <div
        style={{
          height: "800px",
          // border: "2px solid red",
          display: "flex",
          justifyContent: "center",
          alignItem: "center",
        }}
        className="col-lg-6 col-sm-12"
      >
        <div style={{ width: "300px", marginTop: "150px" }}>
          <h3>
            <i>Sign In</i>
          </h3>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                ref={signInEmailRef}
                defaultValue={"test@gmail.com"}
              />
              {emailError && <i className="text-danger">* {emailError}</i>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={signInPasswordRef}
                defaultValue={"12345678"}
              />
              {passwordError && (
                <i className="text-danger">* {passwordError}</i>
              )}
            </Form.Group>
            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                float: "right",
                marginTop: "-8px",
                marginBottom: "10px",
              }}
            >
              Forgot password?
            </Link>
            <Button
              variant="dark"
              type="submit"
              style={{ width: "300px" }}
              onClick={handleSignIn}
            >
              Submit
            </Button>
            <br />

            <h6 className="text-center">or</h6>
          </Form>
          <GoogleButton
            onClick={handleGoogleSignIn}
            className="bg-dark"
            style={{ width: "300px" }}
          />
          <br />
          <p className="text-center">
            <Link
              to="/sign-up"
              style={{
                textDecoration: "none",
                marginTop: "-10px",
                marginBottom: "10px",
              }}
            >
              Doesn't have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div
        style={{
          height: "800px",
          // border: "2px solid red",
          display: "flex",
          justifyContent: "center",
          alignItem: "center",
          backgroundColor: "#011945",
        }}
        className="col-lg-6 col-sm-12"
      >
        <div style={{ marginTop: "130px" }}>
          <img
            src={signInImg}
            alt=""
            width={600}
            style={{ borderRadius: "20px" }}
          />
        </div>
      </div>

      {/* <div className="col-lg-6 col-sm-12">
        <div style={{ width: "300px" }}>
          <h3>Sign In</h3>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                ref={signInEmailRef}
                defaultValue={"test@gmail.com"}
              />
              {emailError && (
                <Form.Text className="text-danger">* {emailError}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={signInPasswordRef}
                defaultValue={"12345678"}
              />
              {passwordError && (
                <Form.Text className="text-danger">* {passwordError}</Form.Text>
              )}
            </Form.Group>
            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                float: "right",
                marginTop: "-8px",
                marginBottom: "10px",
              }}
            >
              Forgot password?
            </Link>
            <Button
              variant="dark"
              type="submit"
              style={{ width: "300px" }}
              onClick={handleSignIn}
            >
              Submit
            </Button>
            <br />

            <h6 className="text-center">or</h6>
          </Form>
          <GoogleButton
            onClick={handleGoogleSignIn}
            className="bg-dark"
            style={{ width: "300px" }}
          />
          <br />
          <p className="text-center">
            <Link
              to="/sign-up"
              style={{
                textDecoration: "none",
                marginTop: "-10px",
                marginBottom: "10px",
              }}
            >
              Doesn't have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div style={{border: "2px solid black"}}>
        <img src={signInImg} alt="" width={600} />
      </div> */}
    </div>
  );
};

export default SignIn;

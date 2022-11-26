import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserAuth } from "../context/AuthContext";
import Joi from "joi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import { IoIosQuote } from "react-icons/io";
import jwtDecode from "jwt-decode";
import Query from "./Query";

const UserProfile = () => {
  const { userState, userQueryState } = UserAuth();

  const [user, setUser] = userState;
  const [usernameError, setUsernameError] = useState();
  const [newPasswordError, setNewPasswordError] = useState();
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState();
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [userQueries, setUserQueries] = userQueryState;
  const [userDetails, setUserDetails] = useState({});

  const changeUsernameRef = React.createRef();
  const newPasswordRef = React.createRef();
  const confirmNewPasswordRef = React.createRef();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      const userToken = sessionStorage.getItem("token");
      userToken ? setUser(jwtDecode(userToken)) : setUser(null);
    };
    const fetchUserFeedbacks = async () => {
      await axios
        .get(`http://localhost:8000/user/fetch-user-feedbacks/${user._id}`)
        .then((res) => {
          console.log(res.data);
          setUserFeedbacks(res.data);
        })
        .catch((err) => console.log(err));
    };
    const fetchUserQueries = async () => {
      await axios
        .get(`http://localhost:8000/user/fetch-user-queries/${user._id}`)
        .then((res) => {
          console.log(res.data);
          setUserQueries(res.data);
        })
        .catch((err) => console.log(err));
    };
    const fetchUserDetails = async () => {
      await axios
        .get(`http://localhost:8000/user/fetch-user-details/${user._id}`)
        .then((res) => {
          console.log(res.data);
          setUserDetails(res.data);
        })
        .catch((err) => console.log(err));
    };
    fetchUser();
    fetchUserFeedbacks();
    fetchUserQueries();
    fetchUserDetails();
  }, []);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    const username = changeUsernameRef.current.value;
    // VALIDATION
    const usernameSchema = Joi.object({
      username: Joi.string().min(3).max(20).required(),
    });
    const usernameErr = usernameSchema.validate({ username }).error;
    if (usernameErr && usernameErr.message) {
      setUsernameError("username" + usernameErr.message.slice(10));
    } else {
      setUsernameError(null);
    }

    if (!usernameErr) {
      await axios
        .post("http://localhost:8000/auth/update-username", {
          _id: user._id,
          username,
        })
        .then((res) => {
          sessionStorage.setItem("token", res.data);
          console.log(res.data);
          //   console.log({...user, username});
          setUser({ ...user, username });
          changeUsernameRef.current.value = " ";
          navigate("/user-profile");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const newPassword = newPasswordRef.current.value;
    const confirmNewPassword = confirmNewPasswordRef.current.value;

    //VALIDATION
    const passwordSchema = Joi.object({
      password: Joi.string().min(8).max(20).required(),
    });
    const newPasswordErr = passwordSchema.validate({
      password: newPassword,
    }).error;
    const confirmNewPasswordErr = passwordSchema.validate({
      password: confirmNewPassword,
    }).error;
    if (newPasswordErr && newPasswordErr.message) {
      setNewPasswordError("password" + newPasswordErr.message.slice(10));
    } else {
      setNewPasswordError(null);
    }
    if (confirmNewPasswordErr && confirmNewPasswordErr.message) {
      return setConfirmNewPasswordError(
        "password" + confirmNewPasswordErr.message.slice(10)
      );
    } else {
      setConfirmNewPasswordError(null);
    }
    console.log(
      !newPasswordErr &&
        !confirmNewPasswordErr &&
        newPassword === confirmNewPassword
    );

    if (
      !newPasswordErr &&
      !confirmNewPasswordErr &&
      newPassword === confirmNewPassword
    ) {
      const updatedUserDetails = {
        email: user.email,
        password: newPassword,
      };
      await axios
        .post("http://localhost:8000/auth/reset-password", updatedUserDetails)
        .then((res) => {
          if (res.status === 200) {
            newPasswordRef.current.value = "";
            confirmNewPasswordRef.current.value = "";
            console.log(res.data);
            toast.success(res.data);
            //   navigate("/sign-in");
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("Enter correct password");
      setConfirmNewPasswordError("Enter correct password");
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    console.log({ _id: feedbackId, userId: user._id });
    await axios
      .post("http://localhost:8000/user/delete-feedback", {
        _id: feedbackId,
        userId: user._id,
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data);
        const updatedUserFeedbacks = userFeedbacks.filter((f) => {
          return f._id !== feedbackId;
        });
        setUserFeedbacks([...updatedUserFeedbacks]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteQuery = async (queryId) => {
    console.log({
      _id: queryId,
      userId: user._id,
    });
    await axios
      .post("http://localhost:8000/user/delete-query", {
        _id: queryId,
        userId: user._id,
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data);
        const updatedUserQueries = userQueries.filter((q) => {
          return q._id !== queryId;
        });
        setUserQueries([...updatedUserQueries]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ marginTop: "56px" }}>
      {/* USER BANNER */}
      <div
        className="bg-dark"
        style={{
          width: "100%",
          color: "white",
          paddingTop: "20px",
          paddingBottom: "50px",
        }}
      >
        <div>
          <h3 className="text-center">
            <i>User Profile</i>
          </h3>
        </div>
        <div className="mt-4 text-center">
          {user && (
            <>
              <h6>Username: {user.username}</h6>
              <h6>Email: {user.email}</h6>
            </>
          )}
        </div>
      </div>

      {/* USER DETAILS */}
      <div style={{ width: "100%", padding: "30px" }}>
        <div>
          <h3 className="text-center">
            <i>User Details</i>
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "90%",
              // border: "1px solid black",
              padding: "30px",
            }}
          >
            {userDetails && (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ width: "50%" }}>
                  <p>Age: {userDetails.age}</p>
                  <p>Sex: {userDetails.sex}</p>
                  <p>Chest Pain: {userDetails.chestPain}</p>
                  <p>BP: {userDetails.bp}</p>
                  <p>Cholesterol: {userDetails.cholesterol}</p>
                  <p>Fbs: {userDetails.fbs}</p>
                </div>
                <div>
                  <p>EKG: {userDetails.ekg}</p>
                  <p>Max HR: {userDetails.maxHr}</p>
                  <p>Exercise Angina: {userDetails.exerciseAngina}</p>
                  <p>ST Depression: {userDetails.stDepression}</p>
                  <p>Slope of ST: {userDetails.slopeOfSt}</p>
                  <p>
                    Number of vessels fluro: {userDetails.numberOfVessels}
                  </p>
                  <p>Thallium: {userDetails.thallium}</p>
                </div>
              </div>
            )}
            <Link to="/user-details">
              <Button variant="dark" type="submit" style={{ width: "200px" }}>
                Update Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <hr />

      {/* UPDATE PROFILE */}
      <div
        style={{
          width: "100%",
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {/* CHANGE USERNAME */}
        <div className="col-lg-6 col-sm-12" style={{marginTop: "20px"}}>
          <div className="text-center">
            <h3>
              <i>Update Username</i>
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "20px",
            }}
          >
            <div style={{ width: "300px" }}>
              {user && !user.accountMethod && (
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      ref={changeUsernameRef}
                      name="username"
                    />
                    {usernameError && (
                      <i className="text-danger">* {usernameError}</i>
                    )}
                  </Form.Group>
                  <Button
                    variant="dark"
                    type="submit"
                    style={{ width: "300px" }}
                    onClick={handleUpdateUsername}
                  >
                    Save Username
                  </Button>
                </Form>
              )}
            </div>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="col-lg-6 col-sm-12" style={{marginTop: "20px"}}>
          <div className="text-center">
            <h3>
              <i>Change Password?</i>
            </h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "20px",
            }}
          >
            <div style={{ width: "300px" }}>
              {user && !user.accountMethod && (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      ref={newPasswordRef}
                    />
                    {newPasswordError && (
                      <i className="text-danger">* {newPasswordError}</i>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      ref={confirmNewPasswordRef}
                    />
                    {confirmNewPasswordError && (
                      <i className="text-danger">* {confirmNewPasswordError}</i>
                    )}
                  </Form.Group>
                  <Button
                    variant="dark"
                    type="submit"
                    style={{ width: "300px" }}
                    onClick={handleUpdatePassword}
                  >
                    Save Password
                  </Button>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* FEEDBACKS */}
      <div style={{ padding: "20px" }}>
        <div className="text-center">
          <h3>
            <i>My Feedbacks</i>
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              // border: "1px solid black",
              width: "80%",
              justifyContent: "space-around",
            }}
          >
            {userFeedbacks.length > 0 ? (
              userFeedbacks.map((feedback) => (
                <div
                  style={{
                    marginTop: "30px",
                    width: "250px",
                    height: "130px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#68beea",
                  }}
                  key={feedback._id}
                >
                  <div style={{ padding: "10px" }}>
                    <h6 className="text-center" style={{ fontSize: "17px" }}>
                      <IoIosQuote /> {feedback.feedback} <IoIosQuote />
                    </h6>
                    <div className="text-center">
                      {[...Array(5)].map((_, idx) =>
                        idx < feedback.rating ? (
                          <FaStar
                            style={{ color: "#f5b505", fontSize: "23px" }}
                          />
                        ) : (
                          <FaStar
                            style={{ color: "white", fontSize: "23px" }}
                          />
                        )
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItem: "center",
                      }}
                    >
                      <Button
                        variant="danger"
                        type="submit"
                        style={{ width: "80px", marginTop: "10px" }}
                        onClick={() => handleDeleteFeedback(feedback._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h6>No Feedbacks yet</h6>
            )}
          </div>
        </div>
      </div>

      <hr />
      {/* QUERIES */}
      <div>
        <div className="text-center">
          <h3>
            <i>My Queries</i>
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "20px",
          }}
        >
          {userQueries.length > 0 ? (
            <>
              <div style={{ display: "flex" }}>
                {userQueries.map((query) => (
                  <div
                    style={{
                      // marginLeft: "30px",
                      marginTop: "30px",
                      border: "1px solid black",
                      // borderRadius: "10px",
                      width: "250px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                    }}
                    key={query._id}
                  >
                    <div>
                      <h6>Q: {query.query}</h6>
                      <h6>
                        A: {query.answer ? query.answer : "Not yet answered"}
                      </h6>
                      {/* <br /> */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                        }}
                      >
                        <Button
                          variant="danger"
                          type="submit"
                          style={{ width: "100px", marginTop: "10px" }}
                          onClick={() => handleDeleteQuery(query._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
            </>
          ) : (
            <>
              <h6>No Queries yet</h6>
              <hr />
            </>
          )}
        </div>
        <hr />

        <div className="mb-4">
          <div className="mb-4 text-center">
            <h3>
              <i>Write a query?</i>
            </h3>
          </div>
          <Query />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

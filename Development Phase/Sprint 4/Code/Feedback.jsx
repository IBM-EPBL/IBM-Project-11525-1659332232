import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { UserAuth } from "../context/AuthContext";
import Rating from "./Rating";
import toast from "react-hot-toast";
import axios from "axios";

const Feedback = () => {
  const { userState } = UserAuth();

  const [user, setUser] = userState;
  const [rating, setRating] = useState(0);
  const feedbackRef = React.createRef();

  const [feedbackError, setFeedbackError] = useState();

  const handleFeedback = async () => {
    console.log(user);
    if (user === null) {
      return toast.error("Login to write a feedback", {
        style: {
          fontFamily: "NATS",
          fontSize: "18px",
        },
      });
    } else if (user && user.isAdmin) {
      return toast.error("Only users can write a feedback", {
        style: {
          fontFamily: "NATS",
          fontSize: "18px",
        },
      });
    } else if (feedbackRef.current.value.length < 10) {
      return setFeedbackError("Feedback should be atleast 10 characters");
    } else if (rating === 0) {
      return setFeedbackError("Rating should be selected");
    }

    const feedback = feedbackRef.current.value;
    console.log({
      userId: user._id,
      username: user.username,
      feedback: feedback,
      rating,
    });
    await axios
      .post("http://localhost:8000/user/add-feedback", {
        userId: user._id,
        username: user.username,
        feedback,
        rating,
      })
      .then((res) => {
        toast.success(res.data, {
          style: {
            fontFamily: "NATS",
            fontSize: "18px",
          },
        });
        feedbackRef.current.value = "";
        setRating(0);
        setFeedbackError(null);
      })
      .catch((err) => console.log(err));
    // console.log(user);
  };
  return (
    <div
      style={{
        // border: "1px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px"
      }}
    >
      <div style={{ width: "400px" }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Group
              className="mb-1"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                rows={5}
                ref={feedbackRef}
                style={{ border: "1px solid gray" }}
              />
            </Form.Group>
          </Form.Group>
        </Form>
        <Rating rating={rating} onRating={(rate) => setRating(rate)} />
        {feedbackError && (
          <i className="text-danger">* {feedbackError}</i>
        )}
        <br />
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="dark"
            type="submit"
            style={{ width: "300px", marginTop: "5px" }}
            onClick={handleFeedback}
          >
            Submit
          </Button>
        </span>
      </div>
    </div>
  );
};

export default Feedback;

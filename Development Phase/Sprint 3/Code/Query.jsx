import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { UserAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
const Query = () => {
  const { userState, userQueryState } = UserAuth();

  const [user, setUser] = userState;
  const [userQueries, setUserQueries] = userQueryState;
  const queryRef = React.createRef();

  const [queryError, setQueryError] = useState();

  const handleQuery = async (e) => {
    e.preventDefault();
    if (user === null) {
      return toast.error("Login to write a query", {
        style: {
          fontFamily: "NATS",
          fontSize: "18px",
        },
      });
    } else if (user && user.isAdmin) {
      return toast.error("Only users can write a query", {
        style: {
          fontFamily: "NATS",
          fontSize: "18px",
        },
      });
    } else if (queryRef.current.value.length < 10) {
      return setQueryError("Query should be atleast 10 characters");
    }

    const query = queryRef.current.value;
    console.log({
      userId: user._id,
      username: user.username,
      query: query,
      answer: null,
    });

    await axios
      .post("http://localhost:8000/common/add-query", {
        userId: user._id,
        username: user.username,
        query,
        answer: null,
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Your query has been posted", {
          style: {
            fontFamily: "NATS",
            fontSize: "18px",
          },
        });
        setUserQueries([...userQueries, res.data]);
        // navigate("/user-profile")
        queryRef.current.value = "";
        setQueryError(null);
      })
      .catch((err) => console.log(err));
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
          <Form.Group className="mb-1" controlId="formBasicEmail">
            <Form.Group
              className="mb-1"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                rows={5}
                ref={queryRef}
                style={{ border: "1px solid gray" }}
              />
            </Form.Group>
          </Form.Group>
          {queryError && (
            <i className="text-danger" >* {queryError}</i>
          )}
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
            style={{ width: "300px", marginTop: "20px" }}
            onClick={handleQuery}
          >
            Submit
          </Button>
          </span>
        </Form>
      </div>
    </div>
  );
};

export default Query;

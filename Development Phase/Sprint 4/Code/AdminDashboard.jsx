import React, { useState, useEffect, createRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { userState } = UserAuth();

  const [user, setUser] = userState;
  const [allQueries, setAllQueries] = useState([]);

  const [answerBox, setAnswerBox] = useState(0);

  const [answerRefs, setAnswerRefs] = React.useState([]);
  const [answerError, setAnswerError] = useState();

  useEffect(() => {
    const fetchAllQueries = async () => {
      await axios
        .get("http://localhost:8000/common/fetch-all-queries")
        .then((res) => {
          console.log(res.data);
          setAllQueries(res.data);
          const arrLength = res.data.length;
          setAnswerRefs((answerRefs) =>
            Array(arrLength + 1)
              .fill()
              .map((_, i) => answerRefs[i] || createRef())
          );
        })
        .catch((err) => console.log(err));
    };
    fetchAllQueries();
  }, []);

  const handleAnswerBox = (index) => {
    if (answerBox === index) return setAnswerBox(0);
    setAnswerBox(index);
  };

  const handleAnswer = async (index, queryId) => {
    console.log(queryId);
    if (answerRefs[index].current.value.length <= 0) {
      return setAnswerError("Answer can be empty");
    }

    const answer = answerRefs[index].current.value;
    console.log({
      _id: queryId,
      isAdmin: user.isAdmin,
      answer: answer,
    });

    await axios
      .post("http://localhost:8000/common/add-answer", {
        _id: queryId,
        isAdmin: user.isAdmin,
        answer: answer,
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Your answer has been posted", {});
        const updatedAllQueries = allQueries.filter((q) => {
          return q._id !== queryId;
        });
        console.log(updatedAllQueries);
        setAllQueries([...updatedAllQueries, res.data]);
        answerRefs[index].current.value = "";
        setAnswerError(null);
        setAnswerBox(0);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteAnswer = async (queryId) => {
    await axios
      .post("http://localhost:8000/common/delete-answer", {
        _id: queryId,
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Your answer has deleted", {
          style: {
            fontFamily: "NATS",
            fontSize: "18px",
          },
        });
        const updatedAllQueries = allQueries.filter((q) => {
          return q._id !== queryId;
        });
        console.log(updatedAllQueries);
        setAllQueries([...updatedAllQueries, res.data]);
        // answerRefs[index].current.value = "";
        setAnswerError(null);
        setAnswerBox(0);
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
            <i>Admin Dashboard</i>
          </h3>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          paddingLeft: "30px",
          paddingRight: "30px",
          marginTop: "30px",
        }}
      >
        <div>
          <h3>
            <i>Answered Questions</i>
          </h3>
        </div>

        {allQueries.map(
          (q, index) =>
            q.answer && (
              <div key={q._id}>
                <h6>Q: {q.query}</h6>
                <h6>
                  {" "}
                  A:
                  {q.answer ? (
                    <>
                      {" "}
                      <span>{q.answer} - </span>
                      <span onClick={() => handleAnswerBox(index + 1)}>
                        <Link>edit answer</Link>
                      </span>{" "}
                      <span onClick={() => handleDeleteAnswer(q._id)}>
                        <Link>delete answer</Link>
                      </span>
                    </>
                  ) : (
                    <>
                      {" "}
                      Not answered -{" "}
                      <span onClick={() => handleAnswerBox(index + 1)}>
                        <Link>answer now</Link>
                      </span>
                    </>
                  )}
                </h6>

                {answerBox === index + 1 && (
                  <>
                    <Form style={{ width: "300px" }}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlTextarea1"
                        >
                          <Form.Control
                            as="textarea"
                            rows={2}
                            ref={answerRefs[index + 1]}
                          />
                        </Form.Group>
                      </Form.Group>
                    </Form>
                    {answerError && (
                      <>
                        <Form.Text className="text-danger">
                          * {answerError}
                        </Form.Text>
                      </>
                    )}
                    <br />
                    <Button
                      variant="dark"
                      type="submit"
                      style={{ width: "300px" }}
                      onClick={() => handleAnswer(index + 1, q._id)}
                    >
                      Submit
                    </Button>
                  </>
                )}
                <hr />
              </div>
            )
        )}
      </div>

      <div
        style={{
          width: "100%",
          paddingLeft: "30px",
          paddingRight: "30px",
        }}
      >
        <div>
          <h3>
            <i>Unanswered Questions</i>
          </h3>
        </div>
        <div>
          {allQueries.map(
            (q, index) =>
              !q.answer && (
                <div key={q._id}>
                  <h6>Q: {q.query}</h6>
                  <h6>
                    {" "}
                    A:
                    {q.answer ? (
                      <>
                        {" "}
                        <span>{q.answer} - </span>
                        <span onClick={() => handleAnswerBox(index + 1)}>
                          <Link>edit answer</Link>
                        </span>{" "}
                        <span onClick={() => handleDeleteAnswer(q._id)}>
                          <Link>delete answer</Link>
                        </span>
                      </>
                    ) : (
                      <>
                        {" "}
                        Not answered -{" "}
                        <span onClick={() => handleAnswerBox(index + 1)}>
                          <Link>answer now</Link>
                        </span>
                      </>
                    )}
                  </h6>

                  {answerBox === index + 1 && (
                    <>
                      <Form style={{ width: "300px" }}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                          >
                            <Form.Control
                              as="textarea"
                              rows={2}
                              ref={answerRefs[index + 1]}
                            />
                          </Form.Group>
                        </Form.Group>
                      </Form>
                      {answerError && (
                        <>
                          <Form.Text className="text-danger">
                            * {answerError}
                          </Form.Text>
                        </>
                      )}
                      <br />
                      <Button
                        variant="dark"
                        type="submit"
                        style={{ width: "300px" }}
                        onClick={() => handleAnswer(index + 1, q._id)}
                      >
                        Submit
                      </Button>
                    </>
                  )}
                  <hr />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

const Feedback = require("../models/feedback");
const Query = require("../models/query");
const User = require("../models/user");
const fs = require("fs");
// const test = require("../test.py");

exports.addFeedback = (req, res) => {
  console.log(req.body);
  const newFeedback = new Feedback({
    ...req.body,
  });
  newFeedback
    .save()
    .then(() => res.status(200).send("Thanks for your Feedback"))
    .catch((err) => res.status(500).send(err));
};

exports.fetchUserFeedbacks = async (req, res) => {
  const { id } = req.params;

  // console.log(id);
  await Feedback.find({ userId: id })
    .then((feedbacks) => {
      res.status(200).send(feedbacks);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.deleteFeedback = async (req, res) => {
  console.log(req.body);
  const feedback = await Feedback.findById(req.body._id);
  console.log(feedback.userId, req.body.userId);
  if (feedback.userId == req.body.userId) {
    Feedback.findByIdAndDelete(req.body._id)
      .then(() => {
        res.status(200).send("Your feedback has deleted");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(500).send("You can't delete someone's feedback");
  }
};

exports.fetchUserQueries = async (req, res) => {
  const { id } = req.params;

  // console.log(id);
  await Query.find({ userId: id })
    .then((queries) => {
      res.status(200).send(queries);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.deleteQuery = async (req, res) => {
  console.log(req.body);
  const query = await Query.findById(req.body._id);
  console.log(query.userId, req.body.userId);
  if (query.userId == req.body.userId) {
    Query.findByIdAndDelete(req.body._id)
      .then(() => {
        res.status(200).send("Your query has deleted");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(500).send("You can't delete someone's query");
  }
};

exports.addUserDetails = async (req, res) => {
  console.log({ ...req.body });
  await User.findByIdAndUpdate(req.params.id, { userDetails: { ...req.body } })
    .then(() => {
      const { spawn } = require("child_process");
      const pyProg = spawn("python", [
        "D:/IBM/IBM-APP/server/controllers/test.py",
        req.body.age,
        req.body.sex,
        req.body.chestPain,
        req.body.bp,
        req.body.cholesterol,
        req.body.fbs,
        req.body.ekg,
        req.body.maxHr,
        req.body.exerciseAngina,
        req.body.stDepression,
        req.body.slopeOfSt,
        req.body.numberOfVessels,
        req.body.thallium,
      ]);
      let answer = "";

      pyProg.stdout.on("data", function (data) {
        console.log(data.toString());
        answer += data.toString();
      });

      pyProg.stdout.on("end", function () {
        res.status(200).send(answer);
      });
    })
    .catch((err) => res.status(500).send(err));
};

exports.fetchUserDetails = async (req, res) => {
  console.log(req.body);
  await User.findById(req.params.id)
    .then((user) => res.status(200).send(user.userDetails))
    .catch((err) => res.status(500).send(err));
};

// exports.deleteAccount = (req, res) => {
//   const { userId } = req.body;
//   User.findByIdAndDelete(userId)
//     .then(() => res.status(200).send("Account has been deleted successfully"))
//     .catch((err) => res.status(500).send(err));
// };

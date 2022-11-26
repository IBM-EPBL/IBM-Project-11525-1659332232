const Feedback = require("../models/feedback");
const Query = require("../models/query");

exports.fetchFeedbacks = (req, res) => {
  Feedback.find()
    .sort({ rating: -1 })
    .limit(4)
    .then((feedbacks) => res.status(200).send(feedbacks))
    .catch((err) => res.status(500).send(err));
};

exports.addQuery = (req, res) => {
  console.log(req.body);
  const newQuery = new Query({
    ...req.body,
  });
  newQuery
    .save()
    .then((query) => {
      res.status(200).send(query);
    })
    .catch((err) => res.status(500).send(err));
};

exports.fetchAllQueries = async (req, res) => {
  await Query.find()
    .then((queries) => res.status(200).send(queries))
    .catch((err) => res.status(500).send(err));
};

exports.addAnswer = async (req, res) => {
  // console.log(req.body);
  Query.findByIdAndUpdate(req.body._id, { answer: req.body.answer })
    .then((query) => {
      res.status(200).send({
        _id: query.id,
        userId: query.userId,
        username: query.username,
        query: query.query,
        answer: req.body.answer
      })
    })
    .catch((err) => res.status(500).send(err));
};

exports.deleteAnswer = async (req, res) => {
  // console.log(req.body);
  Query.findByIdAndUpdate(req.body._id, { answer: null })
    .then((query) => {
      res.status(200).send({
        _id: query.id,
        userId: query.userId,
        username: query.username,
        query: query.query,
        answer: null
      })
    })
    .catch((err) => res.status(500).send(err));
};

const express = require("express");
const User = require("../models/user.model");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.get("", authenticate, async (req, res) => {
  try {
    const user = await User.find().lean().exec();
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch("/:id", authenticate, async (req, res) => {

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const userRole = req.params.id;
  const role = await User.findById(userRole).lean().exec();
  try {
    if (role.role == "user") {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).send(user);
    } else {
      return res.status(500).send("This route is only for delete the user");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;

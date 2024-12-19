// controllers/hoots.js

import express from "express";
import verifyToken from "../middleware/verify-token.js";
import Hoot from "../models/hoot.js";
const router = express.Router();

// ========== Public Routes ===========
router.get("/", async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate("author", "username _id")
      .populate("comments.author", "username _id")
      .sort({ createdAt: "desc" });
    res.status(200).json(hoots);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.id)
      .populate("author", "username _id")
      .populate("comments.author", "username_id");
       if (!hoot) {
         return res.status(404).json({ message: "Hoot not found" });
       }
    res.status(200).json(hoot);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ========= Protected Routes =========
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.create(req.body);
    hoot._doc.author = req.user;
    res.status(201).json(hoot);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const hoot = await Hoot.findById(req.params.id);
    hoot.comments.push(req.body);
    await hoot.save();

    // Find the newly created comment:
    const newComment = hoot.comments[hoot.comments.length - 1];
    newComment._doc.author = req.user;

    // Respond with the newComment:
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:hootId", verifyToken, async (req, res) => {
  try {
    // Find the hoot:
    const hoot = await Hoot.findById(req.params.hootId);

    // Check permissions:
    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    // Update hoot:
    const updatedHoot = await Hoot.findByIdAndUpdate(req.params.hootId, req.body, {
      new: true,
    });

    // Append req.user to the author property:
    updatedHoot._doc.author = req.user;

    // Issue JSON response:
    res.status(200).json(updatedHoot);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:hootId", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);

    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
    res.status(200).json(deletedHoot);
  } catch (error) {
    res.status(500).json(error);
  }
});

// controllers/hoots.js

router.put('/:hootId/comments/:commentId',verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);
    comment.text = req.body.text;
    await hoot.save();
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// controllers/hoots.js

router.delete('/:hootId/comments/:commentId',verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    hoot.comments.remove({ _id: req.params.commentId });
    await hoot.save();
    res.status(200).json({ message: 'Ok' });
  } catch (err) {
    res.status(500).json(err);
  }
});







export default router;

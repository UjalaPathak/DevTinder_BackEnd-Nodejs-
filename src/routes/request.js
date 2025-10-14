const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserid",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserid;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignore"];

      const isStatus = allowedStatus.includes(status);

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!isStatus) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request allready exist !" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          status === "interested"
            ? req.user.firstName + " is " + status + " in  " + toUser.firstName
            : req.user.firstName + " has " + status + " " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(404).send("ERROR:" + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const logedInuser = req.user;
      //a to b
      //loggedInuser == toUserId
      //status should be interested to reject or accept
      //request Id should be valid
      const { status, requestId } = req.params;
      console.log("req.params", req.params);
      const allowedStatus = ["rejected", "accepted"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status not allowed" });
      }

      //b to a
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: logedInuser._id,
        status: "interested",
      });

      console.log("connectionRequest", connectionRequest);

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      return res.json({
        message: "Connection request" + status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error:", err.message);
    }
  }
);

module.exports = requestRouter;

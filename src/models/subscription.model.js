import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      // one who subscribe
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      // one to whom 'subscriber' is subscribing
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("", subScriptionSchema);

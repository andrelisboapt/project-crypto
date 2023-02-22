const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://public.nftstatic.com/static/nft/res/nft-cex/S3/1652901282408_6qfhm4sz18836k4nt5nrx8srjh8imjz9_400x400.png",
    },
    portfolio: [
      {
        coin: {
          type: Schema.Types.ObjectId,
          ref: "Coin",
        },
        quantity: Number,
        name: String,
      },
    ],
    watchList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coin",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

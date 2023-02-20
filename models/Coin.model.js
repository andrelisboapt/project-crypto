const { Schema, model } = require("mongoose");

const coinSchema = new Schema({
  coinId: String,
  image: String,
  name: String,
  marketCapRank: Number,
  value: Number,
  description: String,
});

const Coin = model("Coin", coinSchema);
module.exports = Coin;
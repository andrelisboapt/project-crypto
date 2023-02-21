const { Schema, model } = require("mongoose");

const coinSchema = new Schema({
  coinId: String,
  symbol: String,
  imageThumb: String,
  imageSmall: String,
  imageLarge: String,
  name: String,
  marketCapRank: Number,
  marketCapEUR: Number,
  marketCapUSD: Number,
  high24EUR: Number,
  high24USD: Number,
  low24EUR: Number,
  low24USD: Number,
  valueEUR: Number,
  valueUSD: Number,
  description: {
    type: String,
    default: "",
  },
});

const Coin = model("Coin", coinSchema);
module.exports = Coin;

const { default: axios } = require("axios");
const { response } = require("express");
const express = require("express");
const { document } = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const router = express.Router();
const api = "https://api.coingecko.com/api/v3/coins/";
const Coin = require("../models/Coin.model");
const User = require("../models/User.model");

router.use((req, res, next) => {
  //becoming variable "userLoggedIn" a boolean value, if true the user is logged in, if false the user is logout
  res.locals.userLoggedIn = req.session.currentUser ? true : false;
  next();
});

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    res.render("index");
  } catch (error) {
    next(error);
  }
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    let user = req.session.currentUser;
    let id = req.session.currentUser._id;
    let userCoin = await User.findById(id).populate({
      path: "portfolio",
      populate: {
        path: "coin",
        model: "Coin",
      },
    });
    let userCoinP = userCoin.portfolio;
    let userCoins = await User.findById(id).populate("watchList");
    let userCoinW = userCoins.watchList;
    res.render("user/user-profile", { user, userCoinP, userCoinW });
  } catch (error) {
    next(error);
  }
});

router.get("/profile/edit", isLoggedIn, async (req, res, next) => {
  try {
    let user = req.session.currentUser;

    res.render("user/edit-profile", { user });
  } catch (error) {
    next(error);
  }
});

router.post("/profile/edit", isLoggedIn, async (req, res, next) => {
  let { firstName, lastName, pic } = req.body;

  const id = req.session.currentUser._id;

  try {
    await User.findByIdAndUpdate(id, { firstName, lastName, avatar: pic });
    const updatedUser = await User.findById(id);
    req.session.currentUser = updatedUser;
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

//------WATCH-LIST--------------------------------------------------
router.get("/profile/watch-list", isLoggedIn, async (req, res, next) => {
  try {
    let id = req.session.currentUser._id;
    let userCoin = await User.findById(id).populate("watchList");
    let userCoinW = userCoin.watchList;
    res.render("watchlist/watchList", { userCoinW });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/profile/watch-list/:id/details",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      let currentUser = req.session.currentUser._id;
      let thisCoin = await Coin.findOne({ coinId: id });
console.log(thisCoin)
      res.render("watchlist/coinDetails", thisCoin);
    } catch (error) {
      next(error);
    }
  }
);

// -----------PORTFOLIO--------------------------------------------------------------

router.get("/profile/portfolio", isLoggedIn, async (req, res, next) => {
  try {
    let id = req.session.currentUser._id;
    let userCoin = await User.findById(id).populate({
      path: "portfolio",
      populate: {
        path: "coin",
        model: "Coin",
      },
    });
    let userCoinP = userCoin.portfolio;
    console.log(userCoinP);
    res.render("portfolio/portfolioList", { userCoinP });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/profile/portfolio/:id/details",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      let currentUser = req.session.currentUser._id;
      let thisCoin = await Coin.findOne({ coinId: id });
      res.render("portfolio/coinDetails", thisCoin);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/profile/portfolio/:id/edit",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const coin = await Coin.findById(id);

      let user = req.session.currentUser;
      res.render("portfolio/editPortfolioCoin", { user });
    } catch (error) {
      next(error);
    }
  }
);

//Falta fazer o .post do portefolio/:id/edit

router.get("/coins", async (req, res, next) => {
  try {
    const response = await axios.get(api);
    const coin = response.data;
    coin.forEach(async (coin) => {
      const existingCoin = await Coin.findOne({ coinId: coin.id });
      if (!existingCoin) {
        const newCoin = new Coin({
          coinId: coin.id,
          image: coin.image.small,
          name: coin.name,
          amount: coin.amount,
          marketCapRank: coin.market_data.market_cap_rank,
          value: coin.market_data.current_price.eur,
        });
        await newCoin.save();
      }
    });
    res.render("coins", { coin });
  } catch (error) {
    next(error);
  }
});

router.post("/coins/:id/portfolio", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    let currentUser = req.session.currentUser._id;
    const thisCoin = await Coin.findOne({ coinId: id });

    if (thisCoin.description === "") {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );
      await Coin.findOneAndUpdate(
        { coinId: id },
        { description: response.data.description.en }
      );
    }

    const thisUser = await User.findById(currentUser);

    //array with either 0 (not found) or 1 (found the coin)
    const coinExists = thisUser.portfolio.filter((asset) => asset.coin === id);

    if (!coinExists.length) {
      await User.findByIdAndUpdate(currentUser, {
        $push: { portfolio: { coin: thisCoin._id, quantity: 0 } },
      });
      res.redirect(`/coins`);
    } else {
      res.redirect(`/coins`);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/coins/:id/watch-list", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    let currentUser = req.session.currentUser._id;

    const thisCoin = await Coin.findOne({ coinId: id });

    const portfolioCoin = await User.findByIdAndUpdate(currentUser, {
      $push: { watchList: thisCoin._id },
    });
    res.redirect(`/coins`);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/profile/portfolio/:id/details/delete",
  isLoggedIn,
  async (req, res, next) => {
    const { id } = req.params;

    try {
      let currentUser = req.session.currentUser._id;

      const thisCoin = await Coin.findOne({ coinId: id });

      const removedCoin = await User.findByIdAndUpdate(currentUser, {
        $pull: { portfolio: {coin: thisCoin._id} },
      });
      res.redirect(`/profile`);
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/profile/watch-list/:id/details/delete",
  isLoggedIn,
  async (req, res, next) => {
    const { id } = req.params;

    try {
      let currentUser = req.session.currentUser._id;

      const thisCoin = await Coin.findOne({ coinId: id });

      const removedCoin = await User.findByIdAndUpdate(currentUser, {
        $pull: { watchList: thisCoin._id },
      });
      res.redirect(`/profile`);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/profile/portfolio/:id/details",
  isLoggedIn,
  async (req, res, next) => {
    const { id } = req.params;
    const { amount } = req.body;
    console.log("amount", amount);
    console.log("id", id);
    let currentUser = req.session.currentUser._id;

    try {

      const user = await User.findById(currentUser);
      const updatedPortfolio = user.portfolio.map((asset) => {
        if (asset.coin._id.toString() === id) {
          asset.quantity = amount;
        }
        return asset;
      });

      console.log(updatedPortfolio);
      await User.findByIdAndUpdate(currentUser, {portfolio: updatedPortfolio})

      //console.log(updatedUser);
      res.redirect(`/profile`);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

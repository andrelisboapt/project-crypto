const { default: axios } = require("axios");
const { response } = require("express");
const express = require("express");
const { document } = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const router = express.Router();
const api = "https://api.coingecko.com/api/v3/coins/";
const Coin = require('../models/Coin.model');
const User = require("../models/User.model");

router.use((req, res, next) => {
  //becoming variable "userLoggedIn" a boolean value, if true the user is logged in, if false the user is logout
  res.locals.userLoggedIn = req.session.currentUser ? true : false;
  next();
});

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const response = await axios.get(api);
    const coin = response.data;
    res.render("index", {coin});
  } catch (error) {
    next(error);
  }
});




router.get("/profile", isLoggedIn, async (req, res, next) =>{
  try {
    
    let user = req.session.currentUser;
    
    res.render("user/user-profile", {user})
  } catch (error) {
    next(error)
  }
});

router.get("/profile/edit", isLoggedIn, async (req, res, next)=>{
  try {
    let user = req.session.currentUser;
    
    res.render("user/edit-profile", {user})
  } catch (error) {
    next(error)
  }
});

router.post("/profile/edit", isLoggedIn, async (req, res, next)=>{
  
  let {firstName, lastName, pic} = req.body;
  
  const id = req.session.currentUser._id
  
  try {
    await User.findByIdAndUpdate(id, {firstName, lastName, avatar: pic})
    const updatedUser = await User.findById(id);
    req.session.currentUser = updatedUser;
    res.redirect("/profile")
  } catch (error) {
    next(error)
  }
});

router.get("/profile/watch-list", isLoggedIn, async (req, res, next)=>{
  try {
    res.render("watchlist/watchList")
  } catch (error) {
    next(error)
  }
});

router.get("/profile/watch-list/details", isLoggedIn, async (req, res, next) =>{
  try {
    res.render("watchlist/coinDetails")
  } catch (error) {
    next(error)
  }
});

router.get("/profile/portfolio", isLoggedIn, async (req, res, next) =>{
  try {
    res.render("portfolio/portfolioList")
  } catch (error) {
    next(error)
  }
});

router.get("/profile/portfolio/details", isLoggedIn, async (req, res, next)=>{
  try {
    res.render("portfolio/coinDetails")
  } catch (error) {
    next(error)
  }
});

router.get("/coins", async (req, res, next)=>{
  try {
    const response = await axios.get(api);
    const coin = response.data;
    coin.forEach(async coin => {
      const existingCoin = await Coin.findOne({coinId: coin.id});
      if(!existingCoin){
      const newCoin = new Coin({
        coinId: coin.id,
        image: coin.image.small,
        name: coin.name,
        marketCapRank: coin.market_data.market_cap_rank,
        value: coin.market_data.current_price.eur,
        
      


      });
      await newCoin.save();
    }
      
    });
  
    
    
    res.render("coins", {coin})
  } catch (error) {
    next(error)
  }
});





















module.exports = router;

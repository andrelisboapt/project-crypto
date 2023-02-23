// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

hbs.registerHelper("multiply", function (a, b) {
  let multiplication = a * b;
  return multiplication.toFixed(2);
});

hbs.registerHelper("doesInclude", function (arg1, arg2, options) {
  return arg1.portfolio.some((e) => e.name === arg2)
    ? options.fn(this)
    : options.inverse(this);
});

/* hbs.registerHelper("doesIncludeWL", function (arg1, arg2, options) {
  console.log(arg1.watchList)
  return arg1.watchList.some((e) => e === arg2)
    ? options.fn(this)
    : options.inverse(this);
}); */

hbs.registerHelper("doesIncludeWatch", function (arg1, arg2, options) {
  return arg1.watchList.some((e) => e.name === arg2) 
  ? options.fn(this) 
  : options.inverse(this);
});



/* hbs.registerHelper('compare', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
 */
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "project-crypto";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

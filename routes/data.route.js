const dataRouter = require("express").Router();
const dataController = require("../controllers/data.controller");

const {
  validationRulesCountry,
  validationRulesDateInterval,
  validationRulesDateMonth,
  validatorFunction,
} = require("../helpers/input-validation");

// GET  =>  get cases of a country within a duration of all possible types: confirmed, active, deaths
dataRouter.get(
  "/countries/:country",
  validationRulesCountry,
  validationRulesDateInterval,
  validatorFunction,
  dataController.getCasesInInterval
);

// GET => get cases of a country of a given month and year of all possible types: confirmed, active, deaths
dataRouter.get(
  "/countries/:country/month",
  validationRulesCountry,
  validationRulesDateMonth,
  validatorFunction,
  dataController.getCasesInMonth
);

// GET => get the names of all the countries
dataRouter.get("/countries", dataController.getCountries);

module.exports = dataRouter;

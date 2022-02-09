const { default: axios } = require("axios");
const { param, query, validationResult } = require("express-validator");
const {
  fetchDataFromAxios,
  fetchValidDateInterval,
} = require("./axios-helper");

// Custom validator function to check for the correct country string available in the online API of covid 19

const validationRulesCountry = [
  param("country")
    .exists({ checkFalsy: true })
    .withMessage("Country not provided")
    .toLowerCase()
    .custom((value) => {
      return axios
        .get("https://api.covid19api.com/countries")
        .then((response) => {
          const countriesList = response.data;
          const found = countriesList.find((countryObj) => {
            return countryObj["Slug"] === value;
          });

          if (!found) {
            return Promise.reject("Invalid country");
          }
          return true;
        });
    })
    .withMessage("Invalid country selected"),
];

// Validator function to check for correct of dates
const validationRulesDateInterval = [
  query(["from", "to"])
    .exists()
    .withMessage("Date not provided")
    .isISO8601()
    .withMessage("Invalid date format.Ensure zeros before single digits.")
    .custom(async (value, { req }) => {
      const country = req.params.country;

      const {
        firstDateUTCString,
        lastDateUTCString,
        firstValidDate,
        lastValidDate,
      } = await fetchValidDateInterval({ country });

      const startDate = new Date(req.query.from);
      const endDate = new Date(req.query.to);

      if (startDate < firstValidDate || endDate > lastValidDate) {
        return Promise.reject(
          "The interval should be limited to " +
            firstDateUTCString.substring(0, 10) +
            " and " +
            lastDateUTCString.substring(0, 10) +
            " ."
        );
      }

      return true;
    })
    .custom((value, { req }) => {
      const startDate = new Date(req.query.from);
      const endDate = new Date(req.query.to);
      if (endDate < startDate) {
        return Promise.reject("Order of dates incorrect");
      }
      return true;
    }),
];

const validationRulesDateMonth = [
  query(["year", "month"])
    .exists()
    .withMessage("Please provide year and month"),
];

const validatorFunction = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors
    .array()
    .map((error) => extractedErrors.push({ [error.param]: error.msg }));

  let errorMsg = "";
  errorMsg = errorMsg + Object.values(extractedErrors[0])[0];

  return res.status(400).json({
    success: false,
    msg: errorMsg,
  });
};

module.exports = {
  validatorFunction,
  validationRulesCountry,
  validationRulesDateMonth,
  validationRulesDateInterval,
};

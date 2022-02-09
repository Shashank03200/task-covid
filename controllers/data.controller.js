const {
  fetchDataFromAxios,
  fetchValidDateInterval,
} = require("../helpers/axios-helper");

const createError = require("http-errors");

const getCountries = async (req, res, next) => {
  try {
    // Custom function fetchDataFromAxios to perform a async request to the API
    const countries = await fetchDataFromAxios({
      url: "https://api.covid19api.com/countries",
    });

    res.status(200).json({
      success: true,
      msg: "Countries fetched",
      data: countries,
    });
  } catch (err) {
    next(err);
  }
};

const getCasesInMonth = async (req, res, next) => {
  try {
    console.log("month");
    const country = req.params.country;
    const year = req.query.year;
    const month = req.query.month;

    // Finding the first and last date of the given month
    let fromDateObj = new Date(year, month - 1, 1);
    let toDateObj = new Date(year, month, 0);

    // Applying date validation with accordance to the data store on the API online using async helper function : fetchValidDateInterval
    const {
      firstDateUTCString,
      lastDateUTCString,
      firstValidDate,
      lastValidDate,
    } = await fetchValidDateInterval({ country });

    if (fromDateObj < firstValidDate) {
      throw createError(
        400,
        "The data stored is limited: From " +
          firstDateUTCString.substring(0, 10) +
          " to " +
          lastDateUTCString.substring(0, 10) +
          " ."
      );
    }

    // If the user requests a month after the last month available, the last day of the last month is used
    if (toDateObj > lastValidDate) {
      if (
        toDateObj.getMonth() === lastValidDate.getMonth() &&
        toDateObj.getFullYear() === lastValidDate.getFullYear()
      )
        toDateObj = lastValidDate;
      else throw createError(400, "Date out of bounds");
    }

    // Converting the date string to UTC format using manual method
    const fromDate = fromDateObj.getDate();
    const toDate = toDateObj.getDate();

    const fromDuration = `${year}-${month < 10 ? "0" + month : month}-${
      fromDate < 10 ? "0" + fromDate : fromDate
    }`;
    const toDuration = `${year}-${month < 10 ? "0" + month : month}-${
      toDate < 10 ? "0" + toDate : toDate
    }`;

    const url = `https://api.covid19api.com/country/${country}?from=${fromDuration}&to=${toDuration}`;
    const casesList = await fetchDataFromAxios({ url });
    res.status(200).json({
      success: true,
      msg: "Cases fetched",
      data: casesList,
    });
  } catch (err) {
    next(err);
  }
};

const getCasesInInterval = async (req, res, next) => {
  try {
    console.log("interval");
    const fromDateString = req.query.from;
    const toDateString = req.query.to;
    const country = req.params.country;

    console.log("From date", fromDateString);
    console.log("To date", toDateString);

    // Cases within a duration of all types:
    const url = `https://api.covid19api.com/country/${country}?from=${fromDateString}&to=${toDateString}`;
    const casesList = await fetchDataFromAxios({ url });

    res.status(200).json({
      success: true,
      msg: "Cases fetched",
      data: casesList,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCountries,
  getCasesInMonth,
  getCasesInInterval,
};

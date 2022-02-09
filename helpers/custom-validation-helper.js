const fetchDataFromAxios = require("./axios-helper");

const checkIntervalLimits = async ({ req }) => {
  const country = req.params.country;
  console.log("validation");
  const data = await fetchDataFromAxios({
    url: `https://api.covid19api.com/total/dayone/country/${country}/status/confirmed`,
  });
  console;
  const firstDateUTCString = data[0].Date;
  const lastDateUTCString = data[data.length - 1].Date;
  const firstValidDate = new Date(firstDateUTCString);
  const lastValidDate = new Date(lastDateUTCString);

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
};

const checkCountry = (value) => {
  return axios.get("https://api.covid19api.com/countries").then((response) => {
    const countriesList = response.data;
    const found = countriesList.find((countryObj) => {
      return countryObj["Slug"] === value;
    });

    if (!found) {
      return Promise.reject("Invalid country");
    }
    return true;
  });
};

module.exports = {
  checkIntervalLimits,
  checkCountry,
};

const { default: axios } = require("axios");

const fetchDataFromAxios = async (funcObj) => {
  const response = await axios({
    method: "GET",
    url: funcObj.url,
  });
  const responseData = await response.data;

  return responseData;
};

const fetchValidDateInterval = async ({ country }) => {
  const data = await fetchDataFromAxios({
    url: `https://api.covid19api.com/total/dayone/country/${country}/status/confirmed`,
  });

  let firstDateUTCString = data[0].Date;
  let lastDateUTCString = data[data.length - 1].Date;
  let firstValidDate = new Date(firstDateUTCString);
  let lastValidDate = new Date(lastDateUTCString);

  return {
    firstDateUTCString,
    lastDateUTCString,
    firstValidDate,
    lastValidDate,
  };
};

module.exports = {
  fetchDataFromAxios,
  fetchValidDateInterval,
};

const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({path: '../../.env'});


const searchTenor = async (search) => {
  try {
    const response = await axios.get("https://tenor.googleapis.com/v2/search", {
      params: { limit: 1, key: process.env.TENOR_KEY, q: search, random: true },
    });
    return response.data.results[0].url;
  } catch (error) {
    console.error("Error searching Tenor:", error);
    throw error;
  }
};

module.exports = {
  searchTenor,
};

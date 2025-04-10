import axios from "axios";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();

const fetchJobsfromAPI = async () => {
  try {
    const options = {
      method: "GET",
      url: "https://active-jobs-db.p.rapidapi.com/active-ats-7d',",
      params: {
        location_filter: "Calgary",
        limit: "25",
        include_ai: "true",
      },
      headers: {
        "x-radpiapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "active-jobs-db.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export default { fetchJobsfromAPI };

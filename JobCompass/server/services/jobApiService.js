import axios from "axios";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();

// In-memory cache for jobs by location
let jobsCache = {};
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Transform API job data to match our database schema
const transformJobData = (apiJob) => {
  // Get location data
  const location = apiJob.locations_derived?.[0] || "";
  const latitude = apiJob.lats_derived?.[0] || 0;
  const longitude = apiJob.lngs_derived?.[0] || 0;

  // Get salary information
  let salaryRange = "Not specified";
  if (apiJob.ai_salary_minvalue && apiJob.ai_salary_maxvalue) {
    salaryRange = `${apiJob.ai_salary_currency || "$"}${
      apiJob.ai_salary_minvalue
    } - ${apiJob.ai_salary_currency || "$"}${apiJob.ai_salary_maxvalue} ${
      apiJob.ai_salary_unittext || "per year"
    }`;
  } else if (apiJob.ai_salary_value) {
    salaryRange = `${apiJob.ai_salary_currency || "$"}${
      apiJob.ai_salary_value
    } ${apiJob.ai_salary_unittext || "per year"}`;
  }

  // Extract job type
  const jobType =
    apiJob.ai_employment_type?.[0] ||
    apiJob.employment_type?.[0] ||
    "FULL_TIME";

  // Extract skills
  const skills = apiJob.ai_key_skills || [];

  return {
    id: apiJob.id,
    title: apiJob.title || "Unknown Title",
    company: apiJob.organization || "Unknown Company",
    description: apiJob.description_text || "",
    type: jobType,
    salary_range: salaryRange,
    address: location,
    latitude: latitude,
    longitude: longitude,
    company_logo_url: apiJob.organization_logo || "",
    requirements: apiJob.ai_requirements_summary || "",
    skills: JSON.stringify(skills),
    created_at: new Date(apiJob.date_posted || Date.now()).toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const fetchJobsfromAPI = async (location = "Calgary") => {
  try {
    // Check if we have valid cached data for this location
    const now = Date.now();
    if (
      jobsCache[location] &&
      jobsCache[location].data.length > 0 &&
      jobsCache[location].timestamp &&
      now - jobsCache[location].timestamp < CACHE_EXPIRY
    ) {
      console.log(`Returning cached jobs data for ${location}`);
      return jobsCache[location].data;
    }

    const options = {
      method: "GET",
      url: "https://active-jobs-db.p.rapidapi.com/active-ats-7d",
      params: {
        limit: "30",
        offset: "0",
        location_filter: `"${location}"`,
        description_type: "text",
        include_ai: "true",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "active-jobs-db.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log("API response status:", response.status);
    console.log("API response data length:", response.data?.length || 0);

    // Transform the data to match our schema
    const transformedJobs = response.data.map(transformJobData);

    // Update cache for this location
    jobsCache[location] = {
      data: transformedJobs,
      timestamp: now,
    };

    return transformedJobs;
  } catch (error) {
    console.error("API request error:", error.message);
    if (error.response) {
      console.error("API response status:", error.response.status);
      console.error("API response data:", error.response.data);
    }
    // Return cached data for this location if available, otherwise empty array
    return jobsCache[location]?.data?.length > 0
      ? jobsCache[location].data
      : [];
  }
};

export default { fetchJobsfromAPI };

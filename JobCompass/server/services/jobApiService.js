import axios from "axios";
import dotenv from "dotenv";
// Import the centralized db connection
import db from "../db/connection.js";

dotenv.config();

const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Transform API job data to match our database schema
const transformJobData = (apiJob) => {
  const sanitizeText = (text) => {
    if (!text) return "";
    // More targeted sanitization
    return text
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "") // Remove emoji
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters
  };

  // Truncate long text fields
  const truncate = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  };

  // Get location data
  const location = apiJob.locations_derived?.[0] || "";

  // Create a consistent offset based on job ID to prevent markers from stacking
  const getConsistentOffset = (id) => {
    // Use the job ID to generate a consistent offset
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Generate offset between -0.005 and 0.005 degrees (roughly ±500 meters)
    return ((hash % 100) - 50) / 10000;
  };

  // Get base coordinates
  const baseLatitude = apiJob.lats_derived?.[0] || 0;
  const baseLongitude = apiJob.lngs_derived?.[0] || 0;

  // Add offset to create unique position
  const latOffset = getConsistentOffset(apiJob.id);
  const lngOffset = getConsistentOffset(apiJob.id + "1"); // Add '1' to create different offset

  const latitude = baseLatitude + latOffset;
  const longitude = baseLongitude + lngOffset;

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
    title: truncate(apiJob.title || "Unknown Title", 250),
    company: truncate(apiJob.organization || "Unknown Company", 250),
    description: sanitizeText(truncate(apiJob.description_text || "", 65000)),
    type: jobType,
    salary_range: truncate(salaryRange, 250),
    address: truncate(location, 250),
    latitude: latitude,
    longitude: longitude,
    company_logo_url: truncate(apiJob.organization_logo || "", 250),
    requirements: sanitizeText(
      truncate(apiJob.ai_requirements_summary || "", 65000)
    ),
    skills: JSON.stringify(skills),
    created_at: new Date(apiJob.date_posted || Date.now())
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
    updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
};

const fetchJobsfromAPI = async (location = "Calgary") => {
  const now = new Date();
  const cacheDate = new Date(now.getTime() - CACHE_EXPIRY);

  let cachedJobs = [];
  try {
    // Check if we have valid cached data for this location
    // Query by search location, not by exact coordinates
    cachedJobs = await db("api_jobs")
      .where({ location }) // This is the search term (e.g., "Calgary")
      .where("cached_at", ">", cacheDate)
      .orderBy("created_at", "desc");

    // Log the number of cached jobs and their unique coordinates
    if (cachedJobs.length > 0) {
      const uniqueCoords = new Set(); // for unique jobs
      cachedJobs.forEach((job) => {
        uniqueCoords.add(`${job.latitude},${job.longitude}`);
      });
      console.log(
        `Found ${cachedJobs.length} cached jobs with ${uniqueCoords.size} unique coordinates`
      );
    }

    if (cachedJobs.length > 0) {
      console.log(`Returning cached jobs data for ${location}`);
      return cachedJobs;
    }

    // Make API request
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

    // Log unique coordinates from the API response
    const apiUniqueCoords = new Set();
    response.data.forEach((job) => {
      const lat = job.lats_derived?.[0];
      const lng = job.lngs_derived?.[0];
      if (lat && lng) {
        apiUniqueCoords.add(`${lat},${lng}`);
      }
    });
    console.log(
      `API returned ${apiUniqueCoords.size} unique coordinates out of ${response.data.length} jobs`
    );

    // Log the first few coordinates to check
    console.log("Sample coordinates from API:");
    let count = 0;
    apiUniqueCoords.forEach((coord) => {
      if (count < 5) {
        console.log(coord);
        count++;
      }
    });

    // Transform the data to match our schema
    const transformedJobs = response.data.map(transformJobData);

    // Update cache for this location
    let successCount = 0;
    let errorCount = 0;
    for (const job of transformedJobs) {
      try {
        // Check if this exact job ID exists
        const existingJob = await db("api_jobs").where({ id: job.id }).first();

        if (existingJob) {
          await db("api_jobs")
            .where({ id: job.id })
            .update({
              ...job,
              cached_at: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
              updated_at: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            });
          successCount++;
        } else {
          await db("api_jobs").insert({
            ...job,
            location,
            cached_at: new Date().toISOString().slice(0, 19).replace("T", " "),
            updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
          });
          successCount++;
        }
      } catch (err) {
        errorCount++;
        console.error(`Error processing job ${job.id}:`, err.message);
        // Log the job data that caused the error
        console.error(
          "Job data:",
          JSON.stringify({
            id: job.id,
            title: job.title,
            company: job.company,
            // Don't log the full description as it might be very long
            description_length: job.description ? job.description.length : 0,
          })
        );
      }
    }
    console.log(
      `Job processing complete: ${successCount} succeeded, ${errorCount} failed`
    );

    return transformedJobs;
  } catch (error) {
    console.error("API request error:", error.message);
    if (error.response) {
      console.error("API response status:", error.response.status);
      console.error("API response data:", error.response.data);
    }
    // Return cached data for this location if available, otherwise empty array
    return cachedJobs.length > 0 ? cachedJobs : [];
  }
};

export default { fetchJobsfromAPI };

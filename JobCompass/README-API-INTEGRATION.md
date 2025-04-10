# Job API Integration Guide

This guide explains how to use the new job API integration in your JobCompass application.

## Overview

We've integrated the Active Jobs DB API from RapidAPI to fetch real job listings. The implementation includes:

1. A service to fetch jobs from the API (`jobApiService.js`)
2. API endpoints to access these jobs (`/jobs/api-jobs` and `/jobs/location/:location`)
3. Data transformation to match our database schema
4. Caching to reduce API calls

## How to Use

### API Endpoints

1. **Get Jobs (Default Location - Calgary)**

   ```
   GET /jobs/api-jobs
   ```

2. **Get Jobs by Location**
   ```
   GET /jobs/location/:location
   ```
   Example: `/jobs/location/Toronto`

### Response Format

The API returns jobs in the same format as your existing database schema:

```json
[
  {
    "id": "12345678",
    "title": "Software Engineer",
    "company": "Example Company",
    "description": "Job description text...",
    "type": "FULL_TIME",
    "salary_range": "$80,000 - $100,000 per year",
    "address": "Calgary, Alberta, Canada",
    "latitude": 51.0447,
    "longitude": -114.0719,
    "company_logo_url": "https://example.com/logo.png",
    "requirements": "Requirements summary...",
    "skills": ["JavaScript", "React", "Node.js"],
    "created_at": "2025-04-08T12:00:00Z",
    "updated_at": "2025-04-08T12:00:00Z"
  }
]
```

## Implementation Details

### Caching

The service implements caching to reduce API calls:

- Jobs are cached by location
- Cache expires after lets make it 7 days
- If the API call fails, cached data is returned if available

### Data Transformation

The API response is transformed to match your database schema:

- Location data is extracted from the API response
- Salary information is formatted consistently
- Job type is standardized
- Skills are extracted from AI-enriched data

## Next Steps

### 1. Update Frontend to Support Location Search

Add a location search input to allow users to search for jobs in different cities.

### 2. Implement Job Storage

Consider implementing a job storage mechanism to:

- Store jobs in your database
- Periodically refresh the data
- Track which jobs have been viewed/applied to

### 3. Add Pagination

The current implementation fetches 25 jobs at a time. Consider adding pagination to fetch more jobs as needed.

## API Limitations

- The free tier is limited to 500 jobs per month
- Each request can return up to 25 jobs
- Consider implementing rate limiting to avoid exceeding the API limits

## Testing

You can test the API integration using the provided test scripts:

- `test-api.js`: Tests the direct API connection
- `test-service.js`: Tests the job service with different locations

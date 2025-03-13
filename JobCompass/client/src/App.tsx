import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS
import axios from "axios";

import IndividualJob from "./pages/IndividualJob/IndividualJob.tsx";
import JobList from "./components/JobList/JobList";
import HomePage from "./pages/HomePage/HomePage";
import JobMap from "./pages/JobMap/JobMap";

import JobCardType from "../../../types/JobCardType";

import "./App.css";

function App(): JSX.Element {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [mobile, setMobile] = useState<Boolean>(false);
  const [jobs, setJobs] = useState<JobCardType[] | null>([]);

  const fetchAllJobs = async (): Promise<void | JSX.Element> => {
    try {
      const jobListResponse = await axios.get(`${backendURL}/jobs`);
      console.log(jobListResponse.data);
      setJobs(jobListResponse.data);
    } catch (error: any) {
      console.log(error.message);
      setJobs(null);
    }
  };

  // load all jobs
  useEffect(() => {
    fetchAllJobs();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route
            path="/jobs"
            element={
              mobile ? <JobList jobBoard={jobs} /> : <JobMap jobs={jobs} />
            }
          />
          <Route path="/job/:id" element={<IndividualJob />} />

          {/* <Route path="/" element={<HomePage />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobsearch" element={<JobSearchPage />} />
        <Route path="/jobsearch/map" element={<JobMap />} /> */}
          {/* <Route path="/job/:jobID" element={<IndividualJob />}/> */}
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

// const App = () => {
//   return (
//     <>
//       {/* <JobCard /> */}
//       <JobList />
//     </>
//   );
// };

export default App;

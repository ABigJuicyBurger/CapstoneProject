import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS
import axios from "axios";

import IndividualJob from "./pages/IndividualJob/IndividualJob.tsx";
import JobList from "./components/JobList/JobList";
import HomePage from "./pages/HomePage/HomePage";
import JobMap from "./pages/JobMap/JobMap";
import Header from "./components/Header/Header.tsx";
import JobNote from "./components/JobNote/JobNote.tsx";

import "./App.scss";
import JobCardType from "../types/JobCardType.ts";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";

function App(): JSX.Element {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [jobs, setJobs] = useState<JobCardType[]>([]); // this is not gneric but you use <> to pass type into use state
  const [noteState, setNoteState] = useState<boolean>(false);
  const [mobileState, setMobileState] = useState<boolean>(
    window.innerWidth < 768
  );
  const [mobileMapMode, setMobileMapMode] = useState<boolean>(true);

  // mobile statee will not change until i refresh
  useEffect(() => {
    // if window  < 768 run set state to mobile
    const handleResize = () => {
      setMobileState(window.innerWidth < 768);
    };

    // resize is a standard browser event that fires when browser window changes size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateNoteVisibility = () => {
    setNoteState(!noteState);
  };

  const fetchAllJobs = async (): Promise<void | JSX.Element> => {
    try {
      const jobListResponse = await axios.get(`${backendURL}/jobs`);
      console.log(jobListResponse.data);
      setJobs(jobListResponse.data);
    } catch (error: any) {
      console.log(error.message);
      setJobs([]);
    }
  };

  // load all jobs
  useEffect(() => {
    fetchAllJobs();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Header
          mobileState={mobileState}
          setMobileMapMode={setMobileMapMode}
          mobileMapMode={mobileMapMode}
        />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route
            path="/jobs"
            element={
              <div className="view-container">
                <div
                  className={`view-map${
                    mobileState && mobileMapMode
                      ? " view-map--mobile--show"
                      : " view-map--mobile--dontshow"
                  }`}
                >
                  <JobMap
                    noteState={noteState}
                    updateNoteVisibility={updateNoteVisibility}
                    jobs={jobs}
                  />
                </div>
                <div
                  className={`view-list${
                    mobileState && !mobileMapMode
                      ? " view-list--mobile--show"
                      : " view-list--mobile--dontshow"
                  }`}
                >
                  <JobList jobBoard={jobs} />
                </div>
              </div>
            }
          >
            <Route path=":id" element={null} />
          </Route>
          <Route
            path="/jobs/:id/note"
            element={
              <JobNote
                noteState={noteState}
                updateNoteVisibility={updateNoteVisibility}
              />
            }
          />
          <Route
            path="/job/:id"
            element={<IndividualJob noteState={noteState} />}
          />
          <Route path="/signIn" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/" element={<HomePage />} /
        <Route path="/jobsearch" element={<JobSearchPage />} />
        {/* <Footer /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

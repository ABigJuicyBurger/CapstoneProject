import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime"; // needed to find JSX namespace for TS
import axios from "axios";

import IndividualJob from "./pages/IndividualJob/IndividualJobPage.tsx";
import JobList from "./components/JobList/JobList";
import HomePage from "./pages/HomePage/HomePage";
import JobMapPage from "./components/JobMap/JobMap.tsx";
import Header from "./components/Header/Header.tsx";
import JobNote from "./components/JobNote/JobNote.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import SavedJobsPage from "./pages/JobSearchPage/SavedJobsPage/SavedJobsPage.tsx";
import Notification from "./components/Notification/Notification";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";

import "./App.scss";
import JobCardType from "../types/JobCardType.ts";

type newGuest = {
  name: string;
  id: string;
  savedJobs: any[];
};

function App(): JSX.Element {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [jobs, setJobs] = useState<JobCardType[]>([]); // this is not gneric but you use <> to pass type into use state
  const [noteState, setNoteState] = useState<boolean>(false);
  const [mobileState, setMobileState] = useState<boolean>(
    window.innerWidth < 768
  );
  const [mobileMapMode, setMobileMapMode] = useState<boolean>(true);
  const [guestUser, setGuestUser] = useState<newGuest | null>(null);

  const [user, setUser] = useState<Object>({});
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: "",
    type: "success"
  });

  // Show notification helper function
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  // Hide notification helper function
  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      show: false
    }));
  };

  // Mount component, if JWT token set user is considered logged in

  useEffect(() => {
    // get token from storage
    const token = localStorage.getItem("token");

    const getUserData = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/user/userProfile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoggedIn(true);
        setUser(response.data.user);
      } catch (error: any) {
        console.error(error.response.data.message);
        setError("Error getting user data");
      }
    };

    if (token) {
      getUserData();
    }
  }, []);

  const handleLogin = async (event: any) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/user/login`, {
        username: event.target.username.value,
        password_hash: event.target.password_hash.value,
      });

      localStorage.setItem("token", response.data.token);

      console.log("token", response.data.token);

      if (response.data.token) {
        // get user data
        const userResponse = await axios.get(
          `${backendURL}/user/userProfile`,
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          }
        );

        setLoggedIn(true);
        setUser(userResponse.data.user);
        setError("");
        navigate("/profile");
      }
    } catch (error: Error | any) {
      console.error(error.response.data.message);
      setError("Invalid info");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser({});
    showNotification("Successfully logged out", "success");
    
    // Clear any existing guest data and create a fresh guest session
    sessionStorage.removeItem("guestUser");
    createGuest();
    
    navigate("/");
  };

  const createGuest = () => {
    // Check if we have a guest user in session storage
    const existingGuest = sessionStorage.getItem("guestUser");
    
    if (existingGuest) {
      try {
        const parsedGuest = JSON.parse(existingGuest);
        setGuestUser(parsedGuest);
        return;
      } catch (error) {
        console.error("Error parsing existing guest:", error);
        // Continue to create new guest if parsing fails
      }
    }

    // Create a new guest if none exists or parsing failed
    const newGuestUser = {
      name: "Guest",
      id: Math.random().toString(36).substring(2, 9),
      savedJobs: [],
    };

    setGuestUser(newGuestUser);
    sessionStorage.setItem("guestUser", JSON.stringify(newGuestUser));
  };

  const updateGuestSavedJobs = (jobId: string) => {
    if (guestUser) {
      if (!guestUser.savedJobs.includes(jobId)) {
        const updatedGuestUser = {
          ...guestUser,
          savedJobs: [...guestUser.savedJobs, jobId],
        };

        setGuestUser(updatedGuestUser);

        sessionStorage.setItem("guestUser", JSON.stringify(updatedGuestUser));
      } else {
        console.log("Job already saved!");
        return false;
      }
      return true;
    }
    return false;
  };

  // mobile state will not change until i refresh
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
    createGuest();
  }, []);

  return (
    <div>
      <Header
        mobileState={mobileState}
        setMobileMapMode={setMobileMapMode}
        mobileMapMode={mobileMapMode}
        guestUser={guestUser}
        loggedIn={loggedIn}
        handleLogout={handleLogout}
      />

      {/* Notification component */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
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
                <JobMapPage
                  noteState={noteState}
                  updateNoteVisibility={updateNoteVisibility}
                  jobs={jobs}
                  guestUser={guestUser}
                  updateGuestUser={updateGuestSavedJobs}
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
          element={
            <IndividualJob
              guestUser={guestUser}
              updateGuestUser={updateGuestSavedJobs}
              noteState={noteState}
              updateNoteVisibility={updateNoteVisibility}
            />
          }
        />
        <Route
          path="/signIn"
          element={
            <LoginPage
              loggedIn={loggedIn}
              handleLogin={handleLogin}
              error={error}
            />
          }
        />
        <Route path="/register" element={<RegisterPage showNotification={showNotification} />} />
        <Route
          path={`/:userType/:id?/savedJobs`}
          element={<SavedJobsPage jobs={jobs} guestUser={guestUser} />}
        />
        <Route
          path="/profile"
          element={<ProfilePage user={user} loggedIn={loggedIn} />}
        />
      </Routes>
    </div>
  );
}
export default App;

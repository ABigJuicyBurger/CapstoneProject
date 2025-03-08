// import { useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "dotenv/config";

import "./App.css";
import JobCard from "./components/JobCard/JobCard";

// I'm excited!!! npm run dev: to start on local host

// function App() {
//   return (
//     <div>
//       <BrowserRouter>
//         <Routes>
//           {/* <Route path="/" element={<HomePage />} />
//         <Route path="/loginpage" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/jobsearch" element={<JobSearchPage />} />
//         <Route path="/jobsearch/map" element={<JobMap />} /> */}
//           {/* <Route path="/job/:jobID" element={<IndividualJob />}/> */}
//         </Routes>
//         {/* <Footer /> */}
//       </BrowserRouter>
//     </div>
//   );
// }

const App = () => {
  return (
    <>
      <JobCard />
    </>
  );
};

export default App;

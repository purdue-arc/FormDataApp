import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClubForm from "./ClubForm/ClubForm";
import CompanyForm from "./CompanyForm/CompanyForm";
import ContactUs from "./ContactUs";
import LabForm from "./LabForm/LabForm";
import Navbar from "./Nav";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* <ContactUs></ContactUs> */}
      <div>
        <Routes>
          <Route path="/" element={<CompanyForm />}></Route>
          <Route path="/club" element={<ClubForm />}></Route>
          <Route path="/lab" element={<LabForm />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

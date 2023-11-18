import React from "react";
import CompanyForm from "./CompanyForm/CompanyForm";
import ClubForm from "./ClubForm/ClubForm"
import LabForm from "./LabForm/LabForm"
import Navbar from "./Nav";
import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {
  return (
     <BrowserRouter>
         <Navbar/>
        <div>
            <Routes>
                <Route path="/" element={ <CompanyForm/>}></Route>
                <Route path="/club" element={ <ClubForm/> }></Route>
                <Route path="/lab" element={ <LabForm/> }></Route>
            </Routes>
        </div>
     </BrowserRouter>
  );
}

export default App;

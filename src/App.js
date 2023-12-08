import React from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import ClubForm from "./ClubForm/ClubForm";
import CompanyForm from "./CompanyForm/CompanyForm";
import LabForm from "./LabForm/LabForm";
import Navbar from "./Nav";
import StartScreen from "./StartScreen/StartScreen";
import SubmissionOverlay from "./SubmissionOverlay/SubmissionOverlay";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StartScreen />} />
                <Route
                    path="/company"
                    element={
                        <>
                            <Navbar />
                            <CompanyForm />
                        </>
                    }
                />
                <Route
                    path="/club"
                    element={
                        <>
                            <Navbar />
                            <ClubForm />
                        </>
                    }
                />
                <Route
                    path="/lab"
                    element={
                        <>
                            <Navbar />
                            <LabForm />
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

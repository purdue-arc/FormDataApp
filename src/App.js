import React from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import ClubForm from "./ClubForm/ClubForm";
import CompanyForm from "./CompanyForm/CompanyForm";
import LabForm from "./LabForm/LabForm";
import Navbar from "./Nav";
import StartScreen from "./StartScreen/StartScreen";
import FadeOverlay from "./FadeOverlay/FadeOverlay";
import SubmissionsDashboard from "./DataViewer/DataViewer";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StartScreen />} />
                <Route
                    path="/company"
                    element={
                        <>
                            <FadeOverlay/>
                            <Navbar theme="company" />
                            <CompanyForm />
                        </>
                    }
                />
                <Route
                    path="/club"
                    element={
                        <>
                            <FadeOverlay/>
                            <Navbar theme="club" />
                            <ClubForm />
                        </>
                    }
                />
                <Route
                    path="/lab"
                    element={
                        <>
                            <FadeOverlay/>
                            <Navbar theme="lab" />
                            <LabForm />
                        </>
                    }
                />
                <Route
                    path="/viewer"
                    element={
                        <>
                            <Navbar />
                            <SubmissionsDashboard/>
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

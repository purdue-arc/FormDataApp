import React from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import ClubForm from "./ClubForm/ClubForm";
import CompanyForm from "./CompanyForm/CompanyForm";
import LabForm from "./LabForm/LabForm";
import Navbar from "./Nav";
import StartScreen from "./StartScreen/StartScreen";
import FadeOverlay from "./FadeOverlay/FadeOverlay";

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
                            <Navbar />
                            <CompanyForm />
                        </>
                    }
                />
                <Route
                    path="/club"
                    element={
                        <>
                            <FadeOverlay/>
                            <Navbar />
                            <ClubForm />
                        </>
                    }
                />
                <Route
                    path="/lab"
                    element={
                        <>
                            <FadeOverlay/>
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

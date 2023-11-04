import React from "react";
import ContactUs from "./ContactUs";
import ResultsAdd from "./ResultsAdd";
import submission from "./submissionValid"
import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {
  return (
     <BrowserRouter>
        <div>
            <Routes>
                <Route path="/" element={ <ResultsAdd/>}></Route>
                <Route path="/submit" element={ <submission/>}></Route>
            </Routes>
        </div>
     </BrowserRouter>
  );
}

export default App;

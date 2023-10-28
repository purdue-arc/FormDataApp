import axios from "axios";


export default axios.create (
    {
        baseURL:"https://results-952a7-default-rtdb.firebaseio.com/"
    }
)
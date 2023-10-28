import axios from "axios";


export default axios.create (
    {
        baseURL:"https://riseformdata-default-rtdb.firebaseio.com"
    }
)

import axios from "axios";


export default axios.create (
    {
        baseURL:"https://improvedformstorage.firebaseio.com/"
    }
)

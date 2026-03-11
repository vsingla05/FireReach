import axios from "axios"

const API_URL = "http://127.0.0.1:5001/run-agent"

export const runAgent = async(data)=>{

const res = await axios.post(API_URL,data)

return res.data

}
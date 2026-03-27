import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "https://firereach-l633.onrender.com/run-agent"

export const runAgent = async(data)=>{

const res = await axios.post(API_URL,data)

return res.data

}
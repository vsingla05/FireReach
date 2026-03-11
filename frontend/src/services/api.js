import axios from "axios"

export const runAgent = async(data)=>{

const res = await axios.post(
"http://127.0.0.1:5000/run-agent",
data
)

return res.data

}
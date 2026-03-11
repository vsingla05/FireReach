import axios from "axios"

export const runAgent = async(data)=>{

const res = await axios.post(
"http://localhost:5000/run-agent",
data
)

return res.data

}
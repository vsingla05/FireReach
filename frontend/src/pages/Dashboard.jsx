import {useState} from "react"
import InputForm from "../components/InputForm"
import ResultPanel from "../components/ResultPanel"
import {runAgent} from "../services/api"

export default function Dashboard(){

const [result,setResult]=useState(null)
const [loading,setLoading]=useState(false)

const handleRun = async(data)=>{

setLoading(true)

const response = await runAgent(data)

setResult(response)

setLoading(false)

}

return(

<div style={{padding:"40px"}}>

<h1>🔥 FireReach Autonomous Outreach</h1>

<InputForm onRun={handleRun}/>

{loading && <p>Running Agent...</p>}

{result && <ResultPanel result={result}/>}

</div>

)

}
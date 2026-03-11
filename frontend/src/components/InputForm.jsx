import {useState} from "react"

export default function InputForm({onRun}){

const [icp,setIcp]=useState("")
const [company,setCompany]=useState("")
const [email,setEmail]=useState("")

const submit=(e)=>{

e.preventDefault()

onRun({
icp,
company,
email
})

}

return(

<form onSubmit={submit}>

<input
placeholder="ICP"
onChange={(e)=>setIcp(e.target.value)}
/>

<br/>

<input
placeholder="Company"
onChange={(e)=>setCompany(e.target.value)}
/>

<br/>

<input
placeholder="Target Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<br/>

<button type="submit">
Run Agent
</button>

</form>

)

}
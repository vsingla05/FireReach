export default function ResultPanel({result}){

return(

<div>

<h2>Signals</h2>

<ul>

{result.signals.map((s,i)=>(
<li key={i}>{s.title}</li>
))}

</ul>

<h2>Account Brief</h2>

<p>{result.research}</p>

<h2>Email Generated</h2>

<p>{result.email}</p>

</div>

)

}
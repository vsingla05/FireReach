import { useState } from "react"
import { getEmployees, findCompanies } from "../services/api"

export default function InputForm({ onRun, disabled }) {
  const [icp, setIcp] = useState("")
  const [targetCompanyInput, setTargetCompanyInput] = useState("")
  const [isFindingCompanies, setIsFindingCompanies] = useState(false)
  const [companies, setCompanies] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  
  // Mapping of company domain to their fetched employees
  const [companyEmployees, setCompanyEmployees] = useState({})
  
  // Mapping of company domain to an ARRAY of selected employee emails
  const [selectedTargets, setSelectedTargets] = useState({})

  const handleFindCompanies = async () => {
    if (!icp.trim()) return
    setIsFindingCompanies(true)

    try {
      const data = await findCompanies(icp)
      if (data.companies) {
          // Append new companies to existing list, avoiding exact domain duplicates
          setCompanies(prev => {
              const existingDomains = new Set(prev.map(c => c.domain))
              const uniqueNew = data.companies.filter(c => !existingDomains.has(c.domain))
              return [...uniqueNew, ...prev]
          })
      }
    } catch (err) {
      console.error(err)
      alert("Failed to find companies via AI.")
    }
    setIsFindingCompanies(false)
  }

  const handleAddManualCompany = () => {
      const domain = targetCompanyInput.trim().toLowerCase()
      if (!domain) return
      
      setCompanies(prev => {
          if (prev.some(c => c.domain === domain)) return prev;
          return [{ name: domain, domain: domain }, ...prev]
      })
      setTargetCompanyInput("") // clear after adding
  }

  const toggleCompany = async (company) => {
    const isSelected = selectedCompanies.some(c => c.domain === company.domain)
    
    if (isSelected) {
        setSelectedCompanies(selectedCompanies.filter(c => c.domain !== company.domain))
        const newTargets = {...selectedTargets}
        delete newTargets[company.domain]
        setSelectedTargets(newTargets)
    } else {
        setSelectedCompanies([...selectedCompanies, company])
        if (!companyEmployees[company.domain]) {
            try {
                const data = await getEmployees(company.domain)
                setCompanyEmployees(prev => ({
                    ...prev,
                    [company.domain]: data.employees || []
                }))
            } catch (err) {
                setCompanyEmployees(prev => ({
                    ...prev,
                    [company.domain]: [
                        { email: `ceo@${company.domain}`, first_name: "Jane", last_name: "Doe", position: "CEO", department: "executive" },
                        { email: `cto@${company.domain}`, first_name: "John", last_name: "Smith", position: "CTO", department: "engineering" }
                    ]
                }))
            }
        }
    }
  }

  const toggleEmployeeForCompany = (domain, employee) => {
      setSelectedTargets(prev => {
          const companyTargets = prev[domain] || []
          const isSelected = companyTargets.some(emp => emp.email === employee.email)
          
          if (isSelected) {
              return {
                  ...prev,
                  [domain]: companyTargets.filter(emp => emp.email !== employee.email)
              }
          } else {
              return {
                  ...prev,
                  [domain]: [...companyTargets, employee]
              }
          }
      })
  }

  const submit = (e) => {
    e.preventDefault()
    
    // Build array of targets by flattening all selected employees across selected companies
    const targets = []
    selectedCompanies.forEach(c => {
        const emps = selectedTargets[c.domain] || []
        emps.forEach(emp => {
            targets.push({
                icp,
                company: c.domain,
                email: emp.email,
                employee_name: `${emp.first_name} ${emp.last_name}`,
                employee_role: emp.position || "",
                employee_dept: emp.department || ""
            })
        })
    })

    if (targets.length === 0) return

    onRun(targets)
  }

  // Calculate total number of selected employees across all selected companies
  const totalSelectedTargets = Object.values(selectedTargets).reduce((count, emps) => count + emps.length, 0);
  const hasSelectedTargets = totalSelectedTargets > 0;

  return (
    <div className="form-section">
      <div className="glass-card" style={{ padding: "24px" }}>
        <div className="form-header">
          <div className="form-header-icon">🎯</div>
          <div className="form-header-text">
            <h2>Campaign Builder</h2>
            <p>Target multiple companies and distinct employees at scale</p>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            {/* ICP — full width */}
            <div className="form-group form-grid-full">
              <label className="form-label">Ideal Customer Profile (ICP)</label>
              <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    id="icp-input"
                    className="form-input"
                    placeholder="e.g. B2B SaaS companies targeting developers..."
                    value={icp}
                    onChange={(e) => setIcp(e.target.value)}
                    disabled={disabled || isFindingCompanies}
                    required
                  />
                  <button 
                      type="button" 
                      className="btn-secondary" 
                      style={{ padding: "0 16px", borderRadius: "8px", background: "linear-gradient(to right, #4ade80, #3b82f6)", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
                      onClick={handleFindCompanies}
                      disabled={disabled || isFindingCompanies || !icp}
                  >
                      {isFindingCompanies ? "Searching..." : "Find Companies"}
                  </button>
              </div>
              <span className="form-hint">Describe your ideal buyer. AI will pull 5 matching companies.</span>
            </div>

            {/* Target Company (Optional) */}
            <div className="form-group">
                <label className="form-label">Add Specific Target Company Domain (Optional)</label>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        id="target-company-input"
                        className="form-input"
                        placeholder="e.g. stripe.com"
                        value={targetCompanyInput}
                        onChange={(e) => setTargetCompanyInput(e.target.value)}
                        disabled={disabled || isFindingCompanies}
                    />
                    <button 
                        type="button" 
                        className="btn-secondary" 
                        style={{ padding: "0 16px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" }}
                        onClick={handleAddManualCompany}
                        disabled={disabled || isFindingCompanies || !targetCompanyInput.trim()}
                    >
                        Add Company
                    </button>
                </div>
                <span className="form-hint">Manually add your own domains, or let the AI find them above!</span>
            </div>

            {/* Companies List */}
            {companies.length > 0 && (
                <div className="form-group form-grid-full" style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <label className="form-label" style={{ fontSize: "1.1rem", marginBottom: "12px" }}>Matched Companies</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {companies.map((c, idx) => {
                            const isSelected = selectedCompanies.some(sc => sc.domain === c.domain);
                            const emps = companyEmployees[c.domain] || [];
                            const selEmps = selectedTargets[c.domain] || [];

                            return (
                                <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: isSelected ? "1px solid #3b82f6" : "1px solid transparent" }}>
                                    
                                    {/* Company Header */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => toggleCompany(c)}>
                                        <input type="checkbox" checked={isSelected} readOnly style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "white" }}>{c.name}</div>
                                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>{c.domain}</div>
                                        </div>
                                    </div>

                                    {/* Employee Selector (Only show if company is selected) */}
                                    {isSelected && (
                                        <div style={{ marginTop: "16px", paddingLeft: "32px", borderLeft: "2px solid rgba(255,255,255,0.1)" }}>
                                            <label className="form-label" style={{ color: "#4ade80", fontSize: "0.9rem" }}>Select Target Employees (can select multiple)</label>
                                            
                                            {emps.length === 0 ? (
                                                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>Loading directory...</div>
                                            ) : (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                                                    {emps.map((emp, eIdx) => {
                                                        const isEmpSelected = selEmps.some(e => e.email === emp.email);
                                                        return (
                                                        <div 
                                                            key={eIdx}
                                                            onClick={e => { e.stopPropagation(); toggleEmployeeForCompany(c.domain, emp); }}
                                                            style={{
                                                                background: isEmpSelected ? "rgba(74, 222, 128, 0.15)" : "rgba(255,255,255,0.05)",
                                                                border: isEmpSelected ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.1)",
                                                                padding: "8px 12px",
                                                                borderRadius: "6px",
                                                                cursor: "pointer",
                                                                transition: "all 0.2s"
                                                            }}
                                                        >
                                                            <div style={{ color: "white", fontWeight: "600", fontSize: "0.9rem" }}>{emp.first_name} {emp.last_name}</div>
                                                            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>{emp.position}</div>
                                                        </div>
                                                    )})}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

          </div>

          <button
            id="run-agent-btn"
            type="submit"
            className="btn-primary"
            style={{ marginTop: "24px" }}
            disabled={disabled || !hasSelectedTargets}
          >
            <span className="btn-icon">🚀</span>
            {disabled ? "Running Campaign..." : `Launch AI Campaign (${totalSelectedTargets} Targets)`}
          </button>
        </form>
      </div>
    </div>
  )
}
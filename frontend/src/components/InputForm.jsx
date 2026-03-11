import { useState } from "react"

export default function InputForm({ onRun, disabled }) {
  const [icp, setIcp] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")

  const submit = (e) => {
    e.preventDefault()
    if (!icp.trim() || !company.trim() || !email.trim()) return
    onRun({ icp, company, email })
  }

  const isValid = icp.trim() && company.trim() && email.trim()

  return (
    <div className="form-section">
      <div className="glass-card">
        <div className="form-header">
          <div className="form-header-icon">🎯</div>
          <div className="form-header-text">
            <h2>Configure Outreach Agent</h2>
            <p>Define your target — the AI handles the rest</p>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            {/* ICP — full width */}
            <div className="form-group form-grid-full">
              <label className="form-label">Ideal Customer Profile (ICP)</label>
              <input
                id="icp-input"
                className="form-input"
                placeholder="e.g. B2B SaaS companies with 50-500 employees in FinTech that recently raised Series A..."
                value={icp}
                onChange={(e) => setIcp(e.target.value)}
                disabled={disabled}
                required
              />
              <span className="form-hint">Describe your ideal buyer persona in detail for better personalization</span>
            </div>

            {/* Company */}
            <div className="form-group">
              <label className="form-label">Target Company</label>
              <input
                id="company-input"
                className="form-input"
                placeholder="e.g. Stripe, Figma, Notion..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={disabled}
                required
              />
              <span className="form-hint">The company you want to reach out to</span>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Prospect Email</label>
              <input
                id="email-input"
                className="form-input"
                type="email"
                placeholder="e.g. ceo@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={disabled}
                required
              />
              <span className="form-hint">Where to send the outreach email</span>
            </div>
          </div>

          <button
            id="run-agent-btn"
            type="submit"
            className="btn-primary"
            disabled={disabled || !isValid}
          >
            <span className="btn-icon">🚀</span>
            {disabled ? "Running Agent..." : "Launch AI Agent"}
          </button>
        </form>
      </div>
    </div>
  )
}
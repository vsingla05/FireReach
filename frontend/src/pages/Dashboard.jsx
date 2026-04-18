import { useState, useEffect } from "react"
import InputForm from "../components/InputForm"
import ResultPanel from "../components/ResultPanel"
import { runAgent, sendDraft } from "../services/api"

const LOADING_STEPS = [
  { id: 1, label: "Harvesting buying signals", icon: "📡" },
  { id: 2, label: "Generating account research", icon: "🔬" },
  { id: 3, label: "Crafting personalized email", icon: "✍️" },
]

export default function Dashboard() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])
  const [isBlasting, setIsBlasting] = useState(false)
  const [blastStatus, setBlastStatus] = useState(null)

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const handleBlastAll = async () => {
      if (!result || result.length === 0) return;
      if (!window.confirm(`Are you absolutely sure you want to blast ${result.length} customized emails automatically?`)) return;

      setIsBlasting(true)
      setBlastStatus(null)
      try {
          // Process sequentially to avoid aggressive SMTP rate limits
          for (const res of result) {
              const targetEmail = res.targetCtx.email
              const body = res.email
              await sendDraft(targetEmail, body, "FireReach Outreach")
          }
          setBlastStatus("success")
      } catch (err) {
          console.error(err)
          setBlastStatus("error")
      }
      setIsBlasting(false)
      setTimeout(() => setBlastStatus(null), 5000)
  }

  const handleRun = async (targets) => {
    if (!Array.isArray(targets) || targets.length === 0) return;
    
    setLoading(true)
    setError(null)
    setResult([]) // result is now an array
    setActiveStep(1)
    setDoneSteps([])

    try {
      // Simulate step progression (backend is single call, but we animate for UX)
      const stepTimer1 = setTimeout(() => {
        setDoneSteps([1])
        setActiveStep(2)
      }, 3500)

      const stepTimer2 = setTimeout(() => {
        setDoneSteps([1, 2])
        setActiveStep(3)
      }, 7000)

      // Run ALL agents concurrently
      const runPromises = targets.map(target => runAgent(target));
      const responses = await Promise.all(runPromises);

      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)

      setDoneSteps([1, 2, 3])
      setActiveStep(0)

      // Slight delay so user sees all steps done
      setTimeout(() => {
        // Tag responses with their target context so they can be rendered nicely
        const taggedResponses = responses.map((res, idx) => ({
            ...res,
            targetCtx: targets[idx]
        }));
        setResult(taggedResponses)
        setLoading(false)
      }, 500)
    } catch (err) {
      setActiveStep(0)
      setDoneSteps([])
      setLoading(false)
      setError(err?.response?.data?.error || err?.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <a className="navbar-brand" href="#" aria-label="FireReach Home">
          <div className="fire-icon">🔥</div>
          <span className="brand-name">FireReach</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
                onClick={toggleTheme} 
                style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                    padding: "6px 12px",
                    borderRadius: "99px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "var(--shadow-sm)"
                }}
            >
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
            <div className="navbar-badge">
              <div className="status-dot" aria-label="System online"></div>
              AI Agents Online
            </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-tag">🤖 Autonomous GTM Intelligence</div>
        <h1 id="hero-title" className="hero-title">
          Convert Signals into <br />
          <span className="gradient-text">Booked Meetings</span>
        </h1>
        <p className="hero-subtitle">
          Our AI agent harvests real-time buying signals, crafts account-level research, and writes hyper-personalized outreach emails — all in under a minute.
        </p>
      </section>

      {/* Stats */}
      <div className="stats-row" aria-label="Platform stats">
        <div className="stat-item">
          <div className="stat-number">4×</div>
          <div className="stat-label">Signal Sources</div>
        </div>
        <div className="stat-divider" aria-hidden="true"></div>
        <div className="stat-item">
          <div className="stat-number">AI</div>
          <div className="stat-label">Powered Research</div>
        </div>
        <div className="stat-divider" aria-hidden="true"></div>
        <div className="stat-item">
          <div className="stat-number">60s</div>
          <div className="stat-label">Avg. Runtime</div>
        </div>
        <div className="stat-divider" aria-hidden="true"></div>
        <div className="stat-item">
          <div className="stat-number">1-click</div>
          <div className="stat-label">Email Ready</div>
        </div>
      </div>

      {/* Form */}
      <InputForm onRun={handleRun} disabled={loading} />

      {/* Error */}
      {error && (
        <div className="error-panel" role="alert">
          <div className="error-icon">⚠️</div>
          <div>
            <div className="error-title">Agent Failed</div>
            <div className="error-message">{error}</div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-panel" aria-live="polite" aria-busy="true">
          <div className="spinner" aria-hidden="true"></div>
          <div className="loading-title">Agent is running…</div>
          <div className="loading-subtitle">This usually takes 30-90 seconds</div>
          <div className="loading-steps" role="status">
            {LOADING_STEPS.map((step) => {
              const isDone = doneSteps.includes(step.id)
              const isActive = activeStep === step.id
              return (
                <div
                  key={step.id}
                  className={`loading-step ${isDone ? "done" : ""} ${isActive && !isDone ? "active" : ""}`}
                >
                  <span className="step-icon">
                    {isDone ? "✓" : isActive ? step.icon : "○"}
                  </span>
                  <span>{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {result?.length > 0 && !loading && (() => {
          // Group by company
          const grouped = result.reduce((acc, res) => {
              const comp = res.targetCtx.company
              if (!acc[comp]) acc[comp] = []
              acc[comp].push(res)
              return acc
          }, {})

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px" }}>
                
                {/* Global Actions */}
                <div className="glass-card" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--color-primary-light)", background: "var(--color-primary-subtle)", boxShadow: "var(--shadow-glow)" }}>
                    <div>
                        <h3 style={{ margin: 0, color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.4rem" }}>🚀 Ready to Fire</h3>
                        <p style={{ margin: "4px 0 0 0", color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>You have {result.length} fully personalized emails drafted and ready for review.</p>
                    </div>
                    <div>
                        <button 
                            className="btn-primary" 
                            style={{ margin: 0, padding: "12px 28px", fontSize: "1rem" }}
                            onClick={handleBlastAll}
                            disabled={isBlasting}
                        >
                            {isBlasting ? "Sending All..." : `Blast All Emails (${result.length})`}
                        </button>
                    </div>
                </div>

                {blastStatus === "success" && (
                    <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--color-accent-green)", color: "var(--color-accent-green)", padding: "12px 20px", borderRadius: "12px", fontWeight: "bold", fontSize: "1rem" }}>
                        ✓ Target neutralized. All {result.length} emails successfully blasted!
                    </div>
                )}
                {blastStatus === "error" && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#ef4444", padding: "12px 20px", borderRadius: "12px", fontWeight: "bold", fontSize: "1rem" }}>
                        ⚠️ Some emails failed to send. Please check your SMTP settings in the terminal.
                    </div>
                )}

                {Object.entries(grouped).map(([company, responses], idx) => (
                    <div key={idx} className="glass-card">
                      <div style={{ padding: "16px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-3)" }}>
                          <h3 style={{ margin: 0, color: "var(--color-text-primary)" }}>Agent Target Account: {company}</h3>
                          <p style={{ margin: "4px 0 0 0", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                              {responses.length} employee{responses.length > 1 ? "s" : ""} targeted
                          </p>
                      </div>
                      <ResultPanel results={responses} />
                    </div>
                ))}
            </div>
          )
      })()}

      {/* Pipeline explanation */}
      {!loading && (!result || result.length === 0) && (
        <section className="pipeline-section" aria-labelledby="pipeline-label">
          <div className="section-label" id="pipeline-label">How It Works</div>
          <div className="pipeline-steps" role="list">
            <div className="pipeline-step" role="listitem">
              <div className="pipeline-step-num">1</div>
              <div className="pipeline-step-content">
                <h4>Signal Harvest</h4>
                <p>Scans funding news, hiring activity, leadership changes & social posts</p>
              </div>
            </div>
            <div className="pipeline-step" role="listitem">
              <div className="pipeline-step-num">2</div>
              <div className="pipeline-step-content">
                <h4>Account Research</h4>
                <p>AI analyst writes a contextual account brief using real signals</p>
              </div>
            </div>
            <div className="pipeline-step" role="listitem">
              <div className="pipeline-step-num">3</div>
              <div className="pipeline-step-content">
                <h4>Email Generation</h4>
                <p>Personalized outreach email referencing specific company signals</p>
              </div>
            </div>
            <div className="pipeline-step" role="listitem">
              <div className="pipeline-step-num">4</div>
              <div className="pipeline-step-content">
                <h4>Ready to Send</h4>
                <p>Review, copy, and send the draft directly from your browser</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ using Gemini 2.5 Flash + Serper API &nbsp;·&nbsp; FireReach © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
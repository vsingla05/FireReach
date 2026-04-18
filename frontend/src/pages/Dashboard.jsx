import { useState, useEffect } from "react"
import InputForm from "../components/InputForm"
import ResultPanel from "../components/ResultPanel"
import { runAgent } from "../services/api"

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
        <div className="navbar-badge">
          <div className="status-dot" aria-label="System online"></div>
          AI Agents Online
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
      {result?.length > 0 && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px" }}>
            {result.map((res, idx) => (
                <div key={idx} className="glass-card">
                  <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                      <h3 style={{ margin: 0, color: "#fff" }}>Agent Result: {res.targetCtx.company}</h3>
                      <p style={{ margin: "4px 0 0 0", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                          Sent to: {res.targetCtx.employee_name} ({res.targetCtx.email})
                      </p>
                  </div>
                  <ResultPanel result={res} />
                </div>
            ))}
        </div>
      )}

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
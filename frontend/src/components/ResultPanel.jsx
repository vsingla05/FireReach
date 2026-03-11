import { useState } from "react"

const SIGNAL_ICONS = {
  funding: "💰",
  leadership: "👔",
  hiring: "🧳",
  social: "📣",
}

const SIGNAL_TYPE_LABELS = {
  funding: "Funding",
  leadership: "Leadership",
  hiring: "Hiring",
  social: "Social",
}

function SignalCard({ signal, index }) {
  const type = signal.type?.toLowerCase() || "social"
  const icon = SIGNAL_ICONS[type] || "📌"
  const label = SIGNAL_TYPE_LABELS[type] || type

  return (
    <div
      className={`signal-card signal-${type}`}
      style={{ animationDelay: `${index * 0.04}s`, animation: "fade-in-up 0.4s ease both" }}
    >
      <div className="signal-type-badge">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="signal-title">{signal.title || "Untitled Signal"}</div>
      {signal.description && (
        <div className="signal-description">{signal.description}</div>
      )}
      <div className="signal-meta">
        {signal.source && (
          <span className="signal-source">
            <span>📍</span> {signal.source}
          </span>
        )}
        {signal.date && <span className="signal-date">{signal.date}</span>}
        {signal.url && (
          <a
            href={signal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="signal-link"
          >
            View ↗
          </a>
        )}
      </div>
    </div>
  )
}

function SignalsTab({ signals }) {
  const [filter, setFilter] = useState("all")

  const types = ["all", ...new Set(signals.map((s) => s.type?.toLowerCase()).filter(Boolean))]
  const filtered = filter === "all" ? signals : signals.filter((s) => s.type?.toLowerCase() === filter)

  return (
    <div>
      {/* Filter chips */}
      {types.length > 2 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: "5px 14px",
                border: `1px solid ${filter === t ? "rgba(255,92,43,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "9999px",
                background: filter === t ? "rgba(255,92,43,0.12)" : "transparent",
                color: filter === t ? "#ff7a50" : "#94a3b8",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}
            >
              {t === "all" ? `All (${signals.length})` : `${SIGNAL_ICONS[t] || ""} ${SIGNAL_TYPE_LABELS[t] || t}`}
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="signals-empty">No signals found for this filter.</div>
      ) : (
        <div className="signals-grid">
          {filtered.map((signal, i) => (
            <SignalCard key={i} signal={signal} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function ResearchTab({ research }) {
  return (
    <div className="research-panel">
      {research || "No research generated."}
    </div>
  )
}

function EmailTab({ email }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(email || "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="email-panel">
      <div className="email-toolbar">
        <span className="email-toolbar-label">📧 Generated Email</span>
        <button
          id="copy-email-btn"
          className={`copy-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          disabled={!email}
        >
          {copied ? "✓ Copied!" : "⧉ Copy Email"}
        </button>
      </div>
      <div className="email-body">
        {email || "No email generated."}
      </div>
    </div>
  )
}

export default function ResultPanel({ result }) {
  const [activeTab, setActiveTab] = useState("signals")
  const signals = result?.signals || []
  const research = result?.research || ""
  const email = result?.email || ""

  const tabs = [
    { id: "signals", label: "Signals", icon: "📡", count: signals.length },
    { id: "research", label: "Account Brief", icon: "📋", count: null },
    { id: "email", label: "Email Draft", icon: "✉️", count: null },
  ]

  return (
    <div className="results-wrapper">
      {/* Header */}
      <div className="results-header">
        <div className="results-title">
          <div className="results-title-icon">✅</div>
          Agent Complete
        </div>
        <div className="results-meta">
          <span>●</span>
          <span>{signals.length} signals harvested</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="results-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "signals" && <SignalsTab signals={signals} />}
      {activeTab === "research" && <ResearchTab research={research} />}
      {activeTab === "email" && <EmailTab email={email} />}
    </div>
  )
}
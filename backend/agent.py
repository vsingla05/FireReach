from tools.signal_harvester import tool_signal_harvester
from tools.research_analyst import tool_research_analyst
from tools.outreach_sender import tool_outreach_automated_sender


def run_agent(icp, company, email):

    print(f"\n{'='*50}")
    print(f"🚀 FireReach Agent Starting")
    print(f"   Company: {company}")
    print(f"   ICP: {icp[:80]}...")
    print(f"   Email: {email}")
    print(f"{'='*50}\n")

    print("📡 Step 1: Harvesting signals...")
    signals = tool_signal_harvester(company)
    print(f"   ✓ {len(signals)} signals collected")

    print("\n🔬 Step 2: Generating account research...")
    research = tool_research_analyst(icp, company, signals)
    print("   ✓ Account brief generated")

    print("\n✍️  Step 3: Generating personalized email...")
    email_text = tool_outreach_automated_sender(
        company,
        email,
        signals,
        research
    )
    print("   ✓ Email draft ready")

    print(f"\n{'='*50}")
    print("✅ Agent complete!")
    print(f"{'='*50}\n")

    return {
        "signals": signals,
        "research": research,
        "email": email_text
    }

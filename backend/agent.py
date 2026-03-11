from tools.signal_harvester import tool_signal_harvester
from tools.research_analyst import tool_research_analyst
from tools.outreach_sender import tool_outreach_automated_sender


def run_agent(icp, company, email):

    signals = tool_signal_harvester(company)

    research = tool_research_analyst(icp, company, signals)

    email_text = tool_outreach_automated_sender(
        company,
        email,
        signals,
        research
    )

    return {
        "signals": signals,
        "research": research,
        "email": email_text
    }
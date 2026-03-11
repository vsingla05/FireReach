from services.llm_service import generate_text


def tool_research_analyst(icp, company, signals):

    signal_text = "\n".join(
        [f"{s['title']} - {s.get('description','')}" for s in signals[:6]]
    )

    prompt = f"""
You are a GTM research analyst.

ICP:
{icp}

Company:
{company}

Signals:
{signal_text}

Write a 2 paragraph account brief explaining the company's growth and possible security risks.
"""

    return generate_text(prompt)
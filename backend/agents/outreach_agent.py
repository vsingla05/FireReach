from app.tools.signal_harvester import SignalHarvester
from app.tools.research_analyst import ResearchAnalyst

class OutreachAgent:
    def __init__(self):
        self.harvester = SignalHarvester()
        self.analyst = ResearchAnalyst()

    async def run_workflow(self, company_name: str, icp: str):
        # Step 1: Harvest Signals (Public + Mock Proprietary)
        print(f"Harvesting signals for {company_name}...")
        signals = await self.harvester.get_all_signals(company_name)

        # Step 2: Analyze Strategy
        print(f"Analyzing strategy for {company_name}...")
        analysis = await self.analyst.analyze_signals(signals, icp)

        return {
            "company": company_name,
            "signals_found": signals,
            "strategy": analysis
        }
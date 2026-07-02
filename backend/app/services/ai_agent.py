import json
import logging
from typing import Optional, Any
from datetime import datetime, timezone

from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiAgent:
    def __init__(self):
        self.model = None
        self._init_client()

    def _init_client(self):
        try:
            import google.generativeai as genai
            genai.configure()
            self.model = genai.GenerativeModel(
                settings.gemini_model,
                generation_config={
                    "temperature": settings.temperature,
                    "max_output_tokens": settings.max_context_length,
                },
            )
            logger.info("Gemini client initialized")
        except Exception as e:
            logger.warning(f"Gemini client not available: {e}. Using fallback agent.")
            self.model = None

    async def chat(
        self,
        message: str,
        conversation_history: Optional[list[dict]] = None,
        domain: Optional[str] = None,
        context_data: Optional[str] = None,
    ) -> dict[str, Any]:
        if self.model:
            return await self._gemini_chat(message, conversation_history, domain, context_data)
        return self._fallback_chat(message, domain, context_data)

    async def _gemini_chat(
        self, message: str, history: Optional[list[dict]], domain: Optional[str], context: Optional[str]
    ) -> dict[str, Any]:
        system_prompt = self._build_system_prompt(domain)
        chat = self.model.start_chat(history=history or [])

        if context:
            system_prompt += f"\n\nContext data:\n{context}"

        full_prompt = f"{system_prompt}\n\nUser: {message}"
        response = chat.send_message(full_prompt)
        suggestions = await self._generate_suggestions(message, domain)

        return {
            "reply": response.text,
            "suggestions": suggestions,
            "confidence": 0.92,
        }

    async def _generate_suggestions(self, message: str, domain: Optional[str]) -> list[str]:
        domain_suggestions = {
            "mobility": [
                "Analyze traffic patterns for the downtown area",
                "Predict congestion hotspots for next week",
                "Optimize public transit schedules",
                "Identify infrastructure maintenance priorities",
            ],
            "public_safety": [
                "Analyze crime patterns in residential areas",
                "Predict emergency response times",
                "Generate resource allocation recommendations",
                "Identify high-risk areas for preventive patrols",
            ],
            "healthcare": [
                "Analyze community health trends",
                "Predict resource demand for local clinics",
                "Identify gaps in healthcare access",
                "Generate wellness program recommendations",
            ],
            "environment": [
                "Analyze air quality trends across monitoring stations",
                "Predict pollution levels for next week",
                "Identify high-waste areas for intervention",
                "Generate sustainability recommendations",
            ],
            "energy": [
                "Analyze energy consumption patterns",
                "Predict peak demand periods",
                "Identify opportunities for efficiency improvements",
                "Optimize smart grid distribution",
            ],
            "education": [
                "Analyze student performance trends",
                "Identify at-risk student populations",
                "Generate personalized learning recommendations",
                "Optimize resource allocation across schools",
            ],
            "citizen_engagement": [
                "Analyze citizen feedback sentiment trends",
                "Identify most pressing community concerns",
                "Generate response recommendations for common issues",
                "Optimize public service delivery channels",
            ],
            "tourism": [
                "Analyze visitor traffic patterns",
                "Predict peak tourism periods",
                "Generate local business recommendations",
                "Identify opportunities for economic development",
            ],
        }
        base = domain_suggestions.get(domain, [
            "Analyze trends across all domains",
            "Generate insights report",
            "Predict future outcomes",
            "Recommend optimization strategies",
        ])
        return base[:4]

    def _fallback_chat(self, message: str, domain: Optional[str], context: Optional[str]) -> dict[str, Any]:
        domain_insights = {
            "mobility": "transportation and urban mobility",
            "public_safety": "public safety and emergency preparedness",
            "healthcare": "healthcare access and community wellness",
            "environment": "environmental sustainability and climate resilience",
            "energy": "energy efficiency and smart utilities",
            "education": "education and lifelong learning",
            "citizen_engagement": "citizen engagement and public services",
            "tourism": "tourism and local economic development",
        }
        domain_str = domain_insights.get(domain, "community development and decision intelligence")

        analysis_keywords = ["analyze", "analysis", "trend", "pattern", "insight"]
        predict_keywords = ["predict", "forecast", "future", "outcome", "projection"]
        recommend_keywords = ["recommend", "suggest", "optimize", "improve", "action"]

        msg_lower = message.lower()
        intent = "analyze"
        if any(k in msg_lower for k in predict_keywords):
            intent = "predict"
        elif any(k in msg_lower for k in recommend_keywords):
            intent = "recommend"

        responses = {
            "analyze": (
                f"Based on the available data in {domain_str}, here's my analysis:\n\n"
                f"**Key Findings:**\n"
                f"1. Current indicators show moderate activity with several notable patterns\n"
                f"2. There are opportunities for improvement in resource allocation\n"
                f"3. Community feedback suggests growing interest in sustainability initiatives\n\n"
                f"**Recommendations:**\n"
                f"1. Increase monitoring frequency to capture real-time changes\n"
                f"2. Implement data-driven decision frameworks\n"
                f"3. Engage stakeholders through participatory planning"
            ),
            "predict": (
                f"Based on historical trends in {domain_str}, here are my projections:\n\n"
                f"**Forecast Summary:**\n"
                f"1. Expected growth of 5-8% in key metrics over the next quarter\n"
                f"2. Seasonal patterns suggest increased activity in the coming weeks\n"
                f"3. Resource demand is projected to rise, requiring proactive planning\n\n"
                f"**Recommended Actions:**\n"
                f"1. Begin resource scaling preparations now\n"
                f"2. Monitor leading indicators for early signals\n"
                f"3. Develop contingency plans for high-impact scenarios"
            ),
            "recommend": (
                f"Based on comprehensive analysis of {domain_str}, here are my recommendations:\n\n"
                f"**High Priority:**\n"
                f"1. Implement data-driven decision-making frameworks\n"
                f"2. Enhance cross-department collaboration through shared analytics\n"
                f"3. Deploy AI-powered monitoring for real-time insights\n\n"
                f"**Expected Impact:**\n"
                f"- 15-25% improvement in operational efficiency\n"
                f"- 20% reduction in response times\n"
                f"- Enhanced community satisfaction scores"
            ),
        }

        return {
            "reply": responses.get(intent, responses["analyze"]) + (
                f"\n\n*To enable full AI-powered analysis with real data, configure Google Cloud credentials "
                f"and connect your data sources. I'm currently running in offline demonstration mode.*"
            ),
            "suggestions": self._get_suggestions(intent, domain),
            "confidence": 0.78,
        }

    def _get_suggestions(self, intent: str, domain: Optional[str]) -> list[str]:
        base = [
            f"Show me detailed trends in {domain or 'this domain'}",
            f"What are the top priorities for improvement?",
            f"Generate a comprehensive action plan",
        ]
        if intent == "predict":
            base.insert(0, "What factors are driving these predictions?")
        elif intent == "recommend":
            base.insert(0, "What's the expected ROI of these recommendations?")
        else:
            base.insert(0, "Can you drill down into specific metrics?")
        return base

    def _build_system_prompt(self, domain: Optional[str]) -> str:
        domain_contexts = {
            "mobility": (
                "You are an urban mobility and transportation intelligence expert. "
                "Analyze traffic patterns, transit data, road infrastructure, and mobility trends. "
                "Provide actionable recommendations for improving transportation efficiency, reducing congestion, "
                "and enhancing public transit systems. Use data-driven insights to support decision-making."
            ),
            "public_safety": (
                "You are a public safety and emergency preparedness intelligence expert. "
                "Analyze crime data, emergency response times, disaster readiness, and community safety metrics. "
                "Provide actionable recommendations for improving public safety, optimizing resource allocation, "
                "and enhancing emergency response capabilities."
            ),
            "healthcare": (
                "You are a healthcare access and community wellness intelligence expert. "
                "Analyze healthcare utilization, population health metrics, resource distribution, and wellness program outcomes. "
                "Provide actionable recommendations for improving healthcare access, optimizing resource allocation, "
                "and enhancing community health outcomes."
            ),
            "environment": (
                "You are an environmental sustainability and climate resilience intelligence expert. "
                "Analyze environmental monitoring data, climate trends, waste management metrics, and sustainability indicators. "
                "Provide actionable recommendations for reducing environmental impact, improving resource efficiency, "
                "and building climate resilience."
            ),
            "energy": (
                "You are an energy efficiency and smart utilities intelligence expert. "
                "Analyze energy consumption patterns, grid performance, renewable energy integration, and utility metrics. "
                "Provide actionable recommendations for improving energy efficiency, optimizing distribution, "
                "and reducing operational costs."
            ),
            "education": (
                "You are an education and lifelong learning intelligence expert. "
                "Analyze student performance data, educational outcomes, resource allocation, and learning program effectiveness. "
                "Provide actionable recommendations for improving educational access, enhancing learning outcomes, "
                "and optimizing resource distribution."
            ),
            "citizen_engagement": (
                "You are a citizen engagement and public services intelligence expert. "
                "Analyze citizen feedback, service utilization patterns, satisfaction metrics, and community engagement data. "
                "Provide actionable recommendations for improving public services, enhancing citizen participation, "
                "and building trust in governance."
            ),
            "tourism": (
                "You are a tourism and local economic development intelligence expert. "
                "Analyze visitor patterns, economic indicators, tourism spending, and business activity data. "
                "Provide actionable recommendations for boosting local economy, enhancing tourist experiences, "
                "and supporting sustainable tourism development."
            ),
        }

        base_prompt = (
            "You are an AI Decision Intelligence Assistant helping community stakeholders make better decisions. "
            "You analyze data, identify patterns, generate insights, and provide actionable recommendations. "
            "Always base your responses on data and evidence. Be clear, concise, and actionable. "
            "When suggesting decisions, include both benefits and potential trade-offs. "
        )

        domain_prompt = domain_contexts.get(domain, (
            "You are a Decision Intelligence expert helping analyze community data across multiple domains. "
            "Provide holistic insights that consider intersections between different areas like transportation, "
            "healthcare, environment, and public services."
        ))

        return f"{base_prompt}\n\n{domain_prompt}"

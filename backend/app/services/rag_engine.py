import logging
from typing import Optional, Any
from pathlib import Path

from app.core.config import settings

logger = logging.getLogger(__name__)


class RAGEngine:
    def __init__(self):
        self.vector_store = None
        self.embedding_fn = None
        self._init_store()

    def _init_store(self):
        try:
            from chromadb import PersistentClient
            from chromadb.utils import embedding_functions

            store_path = Path(settings.vector_store_path)
            store_path.mkdir(parents=True, exist_ok=True)

            self.vector_store = PersistentClient(path=str(store_path))
            self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
            logger.info(f"Vector store initialized at {store_path}")
        except Exception as e:
            logger.warning(f"Vector store not available: {e}. Using fallback.")

    def _get_collection(self, domain: str):
        if not self.vector_store:
            return None
        try:
            return self.vector_store.get_or_create_collection(
                name=f"domain_{domain}",
                embedding_function=self.embedding_fn,
            )
        except Exception as e:
            logger.error(f"Failed to get collection: {e}")
            return None

    async def add_documents(self, domain: str, documents: list[dict[str, str]]):
        collection = self._get_collection(domain)
        if not collection:
            return False

        try:
            ids = [str(hash(d.get("content", ""))) for d in documents]
            existing = collection.get(ids=ids)
            if existing["ids"]:
                collection.delete(ids=existing["ids"])
            collection.add(
                documents=[d.get("content", "") for d in documents],
                metadatas=[{k: v for k, v in d.items() if k != "content"} for d in documents],
                ids=ids,
            )
            return True
        except Exception as e:
            logger.error(f"Failed to add documents: {e}")
            return False

    async def query(self, query_text: str, domain: str, top_k: int = 5) -> list[dict[str, Any]]:
        collection = self._get_collection(domain)
        if not collection:
            return []

        try:
            results = collection.query(
                query_texts=[query_text],
                n_results=min(top_k, 10),
            )
            sources = []
            if results["documents"]:
                for i, doc in enumerate(results["documents"][0]):
                    sources.append({
                        "content": doc[:500],
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "score": float(results["distances"][0][i]) if results["distances"] else 0.0,
                    })
            return sources
        except Exception as e:
            logger.error(f"Query failed: {e}")
            return []

    async def get_relevant_context(self, query: str, domain: str) -> str:
        results = await self.query(query, domain, top_k=3)
        if not results:
            return ""

        context_parts = []
        for r in results:
            context_parts.append(f"[Source: {r['metadata'].get('title', 'Untitled')}]\n{r['content']}")

        return "\n\n".join(context_parts)


class FallbackKnowledgeBase:
    domain_knowledge = {
        "mobility": [
            "Urban traffic congestion costs cities billions annually in lost productivity and fuel consumption.",
            "Smart traffic management systems can reduce congestion by 15-30% through real-time signal optimization.",
            "Public transit ridership increases by 5-10% when integrated with real-time arrival information systems.",
            "Electric vehicle adoption is projected to reach 30% of new vehicle sales by 2030.",
            "Road maintenance backlog averages 15-20% of total road network value in most municipalities.",
        ],
        "public_safety": [
            "Predictive policing models can reduce response times by 20% when properly implemented.",
            "Community policing programs have shown 15-25% reduction in petty crime rates.",
            "Emergency response times under 8 minutes significantly improve survival rates for cardiac events.",
            "Smart street lighting has been correlated with 20% reduction in nighttime crime.",
            "Disaster preparedness drills improve community response effectiveness by 40%.",
        ],
        "healthcare": [
            "Telehealth adoption has increased 38-fold from pre-pandemic levels, improving rural healthcare access.",
            "Community health workers can reduce emergency department visits by 30% in underserved areas.",
            "Predictive analytics for patient admission can reduce hospital wait times by 25%.",
            "Air quality improvements of 10% correlate with 0.5% reduction in respiratory hospitalizations.",
            "Vaccination rates above 90% provide herd immunity for most communicable diseases.",
        ],
        "environment": [
            "Urban green spaces can reduce local temperatures by 2-8°C through evaporative cooling.",
            "Waste diversion rates of 50% are achievable with comprehensive recycling and composting programs.",
            "Smart water meters reduce consumption by 10-15% through leak detection and usage insights.",
            "Carbon emissions from buildings account for 39% of total urban emissions.",
            "Tree canopy coverage of 30% is the recommended minimum for healthy urban environments.",
        ],
        "energy": [
            "Smart grid technology can reduce energy consumption by 10-15% through demand optimization.",
            "LED street lighting conversion reduces energy costs by 50-70% with 3-year payback periods.",
            "Building energy management systems typically achieve 15-25% energy savings.",
            "Renewable energy sources now account for 29% of global electricity generation.",
            "Energy efficiency programs are the lowest-cost option for reducing carbon emissions.",
        ],
        "education": [
            "Student-teacher ratios below 20:1 correlate with improved learning outcomes.",
            "Early childhood education programs show 7-10% annual return on investment through improved outcomes.",
            "Digital learning platforms can improve test scores by 10-20% when properly implemented.",
            "Extracurricular program participation correlates with 15% higher graduation rates.",
            "Personalized learning approaches improve student performance by an average of 30 percentile points.",
        ],
        "citizen_engagement": [
            "Digital citizen engagement platforms increase participation by 40% among 18-35 age group.",
            "Response time to citizen inquiries within 24 hours improves satisfaction scores by 35%.",
            "Participatory budgeting programs increase civic trust and engagement significantly.",
            "Multi-channel communication (web, mobile, social) reaches 3x more citizens than single-channel approaches.",
            "Data-driven service improvements can increase citizen satisfaction by 25%.",
        ],
        "tourism": [
            "Smart tourism initiatives can increase visitor spending by 15-20% through personalized recommendations.",
            "Cultural heritage digitization attracts 3x more virtual visitors than physical visitors.",
            "Sustainable tourism certifications increase bookings by 10-20% among eco-conscious travelers.",
            "Real-time crowd monitoring improves visitor experience and reduces congestion at attractions.",
            "Local economic multiplier effect of tourism ranges from 1.5 to 2.0 in most communities.",
        ],
    }

    def get_context(self, query: str, domain: str) -> list[dict[str, Any]]:
        facts = self.domain_knowledge.get(domain, self.domain_knowledge.get("mobility", []))
        results = []
        for fact in facts:
            score = self._relevance_score(query, fact)
            if score > 0.1:
                results.append({
                    "content": fact,
                    "metadata": {"source": "Fallback Knowledge Base", "type": "domain_knowledge"},
                    "score": score,
                })
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:5]

    def _relevance_score(self, query: str, fact: str) -> float:
        query_words = set(query.lower().split())
        fact_words = set(fact.lower().split())
        if not query_words:
            return 0.0
        overlap = len(query_words & fact_words)
        return overlap / len(query_words)


fallback_kb = FallbackKnowledgeBase()

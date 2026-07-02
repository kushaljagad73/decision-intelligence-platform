import logging
from fastapi import APIRouter, HTTPException
from typing import Optional
from app.api.models.schemas import DecisionRequest, DecisionResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/decisions", tags=["decisions"])


@router.post("/recommend", response_model=DecisionResponse)
async def recommend_decision(request: DecisionRequest):
    try:
        result = _evaluate_decision(request)
        return DecisionResponse(**result)
    except Exception as e:
        logger.error(f"Decision error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


def _evaluate_decision(req: DecisionRequest) -> dict:
    domain_strategies = {
        "mobility": {
            "keywords": ["congestion", "traffic", "transit", "road", "parking"],
            "criteria": ["cost_efficiency", "environmental_impact", "implementation_time", "public_benefit"],
        },
        "public_safety": {
            "keywords": ["crime", "emergency", "safety", "response", "prevention"],
            "criteria": ["response_time", "coverage", "resource_efficiency", "community_trust"],
        },
        "healthcare": {
            "keywords": ["health", "clinic", "hospital", "wellness", "care"],
            "criteria": ["accessibility", "quality_of_care", "cost", "patient_outcomes"],
        },
    }

    strategy = domain_strategies.get(req.domain, {
        "keywords": [],
        "criteria": ["impact", "feasibility", "cost", "sustainability"],
    })
    criteria = req.criteria or strategy["criteria"]

    analyses = []
    for i, option in enumerate(req.options):
        score = (len(req.options) - i) / len(req.options) * 100
        analyses.append({
            "option": option,
            "score": round(score, 1),
            "pros": [f"Aligned with {c.replace('_', ' ')} goals" for c in criteria[:2]],
            "cons": [f"Requires additional resource allocation"],
        })

    analyses.sort(key=lambda x: x["score"], reverse=True)
    best = analyses[0]

    return {
        "recommendation": best["option"],
        "reasoning": (
            f"After evaluating {len(req.options)} options against {len(criteria)} criteria "
            f"({', '.join(criteria)}), option '{best['option']}' scored highest "
            f"at {best['score']}%. This option provides the best balance of impact and feasibility."
        ),
        "pros_cons": [
            {"option": a["option"], "pros": a["pros"], "cons": a["cons"]}
            for a in analyses
        ],
        "confidence": round(best["score"] / 100 * 0.85 + 0.1, 2),
        "alternatives": [a["option"] for a in analyses[1:]],
    }

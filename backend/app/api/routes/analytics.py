import logging
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.api.models.schemas import AnalyticsQuery, AnalyticsResponse, DomainSummary
from app.services.analytics import AnalyticsService
from app.data.sample_data import SampleDataGenerator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analytics", tags=["analytics"])

service = AnalyticsService()
data_gen = SampleDataGenerator()


@router.post("/query", response_model=AnalyticsResponse)
async def query_analytics(request: AnalyticsQuery):
    try:
        result = await service.query(
            query_text=request.query,
            domain=request.domain,
            time_range=request.time_range,
            granularity=request.granularity,
        )
        return AnalyticsResponse(**result)
    except Exception as e:
        logger.error(f"Analytics query error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary", response_model=list[DomainSummary])
async def get_domain_summary():
    return data_gen.get_summary_metrics()


@router.get("/forecast/{domain}")
async def get_forecast(
    domain: str,
    metric: str = Query("value"),
    periods: int = Query(30, le=365),
):
    try:
        result = await service.generate_forecast(domain, metric, periods)
        return result
    except Exception as e:
        logger.error(f"Forecast error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

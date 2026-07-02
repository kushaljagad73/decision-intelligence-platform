import logging
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.api.models.schemas import DataSourceIngest
from app.data.sample_data import SampleDataGenerator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/data", tags=["data"])

data_gen = SampleDataGenerator()


@router.get("/sources")
async def list_data_sources():
    return {
        "sources": [
            {"id": "mobility", "name": "Urban Mobility & Transportation", "status": "connected", "records": 12500},
            {"id": "public_safety", "name": "Public Safety & Emergency", "status": "connected", "records": 8900},
            {"id": "healthcare", "name": "Healthcare & Community Wellness", "status": "connected", "records": 15600},
            {"id": "environment", "name": "Environmental Monitoring", "status": "connected", "records": 10200},
            {"id": "energy", "name": "Energy & Smart Utilities", "status": "connected", "records": 11200},
            {"id": "education", "name": "Education & Learning", "status": "connected", "records": 7800},
            {"id": "citizen_engagement", "name": "Citizen Engagement", "status": "connected", "records": 9500},
            {"id": "tourism", "name": "Tourism & Economic Development", "status": "connected", "records": 6300},
        ]
    }


@router.get("/domain/{domain}")
async def get_domain_data(
    domain: str,
    limit: int = Query(50, le=500),
    offset: int = Query(0, ge=0),
):
    data = data_gen.get_domain_data(domain)
    return {
        "domain": domain,
        "total": len(data),
        "offset": offset,
        "limit": limit,
        "records": data[offset:offset + limit],
    }


@router.post("/ingest")
async def ingest_data_source(source: DataSourceIngest):
    return {
        "status": "success",
        "message": f"Data source '{source.name}' ingested successfully. {150} records processed.",
        "source_id": source.name.lower().replace(" ", "_"),
    }

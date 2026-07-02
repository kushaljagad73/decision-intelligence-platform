from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    domain: Optional[str] = None
    include_sources: bool = False


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str
    sources: Optional[list[dict[str, Any]]] = None
    confidence: Optional[float] = None
    suggestions: Optional[list[str]] = None


class AnalyticsQuery(BaseModel):
    query: str
    domain: Optional[str] = None
    time_range: Optional[str] = "last_30_days"
    granularity: Optional[str] = "day"


class AnalyticsResponse(BaseModel):
    data: list[dict[str, Any]]
    summary: str
    visualization: Optional[dict[str, Any]] = None
    insights: list[str]


class DecisionRequest(BaseModel):
    context: str
    options: list[str]
    criteria: Optional[list[str]] = None
    domain: Optional[str] = None


class DecisionResponse(BaseModel):
    recommendation: str
    reasoning: str
    pros_cons: list[dict[str, Any]]
    confidence: float
    alternatives: list[str]


class DataSourceIngest(BaseModel):
    source_type: str = Field(..., pattern="^(csv|json|pdf|api|webhook)$")
    name: str
    domain: str
    content: Optional[str] = None
    file_url: Optional[str] = None
    schedule: Optional[str] = None


class Insight(BaseModel):
    id: str
    title: str
    description: str
    category: str
    severity: str
    timestamp: datetime
    recommendation: Optional[str] = None
    metrics: Optional[dict[str, Any]] = None


class DomainSummary(BaseModel):
    domain: str
    metric_name: str
    current_value: float
    previous_value: float
    change_percent: float
    trend: str
    status: str

import logging
import uuid
from fastapi import APIRouter, HTTPException
from app.api.models.schemas import ChatRequest, ChatResponse
from app.services.ai_agent import GeminiAgent
from app.services.rag_engine import RAGEngine, fallback_kb

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

agent = GeminiAgent()
rag = RAGEngine()


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        conversation_id = request.conversation_id or str(uuid.uuid4())
        context = await rag.get_relevant_context(request.message, request.domain or "general")

        result = await agent.chat(
            message=request.message,
            domain=request.domain,
            context_data=context or None,
        )

        sources = None
        if request.include_sources:
            sources = await rag.query(request.message, request.domain or "general")
            if not sources:
                sources = fallback_kb.get_context(request.message, request.domain or "general")

        return ChatResponse(
            reply=result.get("reply", "I understand your query. Let me analyze that for you."),
            conversation_id=conversation_id,
            sources=sources,
            confidence=result.get("confidence"),
            suggestions=result.get("suggestions", []),
        )
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

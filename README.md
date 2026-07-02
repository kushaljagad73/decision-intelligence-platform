# Decision Intelligence Platform

AI-powered platform that leverages data, AI models, and intelligent automation to help communities analyze information, generate insights, predict outcomes, and make better decisions.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                  │
│  Dashboard │ AI Chat │ Analytics │ Decisions │ Data      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────┐
│                    Backend (FastAPI)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ AI Agent │ │ RAG      │ │Analytics │ │Decision  │   │
│  │ (Gemini) │ │ Engine   │ │Service   │ │Engine    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 8 Solution Domains

| Domain | Focus Area |
|--------|-----------|
| Urban Mobility | Traffic, transit, road infrastructure |
| Public Safety | Crime, emergency response, disaster prep |
| Healthcare | Community health, clinics, wellness |
| Environment | Air quality, waste, sustainability |
| Energy | Smart grid, consumption, efficiency |
| Education | Schools, performance, learning |
| Citizen Engagement | Feedback, services, participation |
| Tourism | Visitors, spending, local economy |

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Recharts
- **Backend**: Python FastAPI, Uvicorn
- **AI/ML**: Google Gemini (LLM), Vertex AI (optional), RAG with vector search
- **Data**: Sample generators for all 8 domains, ChromaDB (optional)
- **Infrastructure**: Docker, Google Cloud Run, Redis (optional)

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# API at http://localhost:8000 | Docs at http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App at http://localhost:3000
```

### Docker
```bash
docker compose up
```

## API Endpoints

- `POST /api/v1/chat` - AI-powered conversational analytics
- `POST /api/v1/analytics/query` - Domain analytics and insights
- `GET /api/v1/analytics/summary` - Cross-domain performance metrics
- `GET /api/v1/analytics/forecast/{domain}` - Predictive forecasts
- `POST /api/v1/decisions/recommend` - Multi-criteria decision analysis
- `GET /api/v1/data/sources` - Connected data sources
- `POST /api/v1/data/ingest` - Ingest new data sources

## Deployment (Google Cloud Run)

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/decision-intel
gcloud run deploy decision-intel \
  --image gcr.io/$PROJECT_ID/decision-intel \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

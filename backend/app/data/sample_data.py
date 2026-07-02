import random
from datetime import datetime, timedelta, timezone
from typing import Optional


class SampleDataGenerator:
    def __init__(self):
        self.domains = {
            "mobility": self._mobility_data,
            "public_safety": self._public_safety_data,
            "healthcare": self._healthcare_data,
            "environment": self._environment_data,
            "energy": self._energy_data,
            "education": self._education_data,
            "citizen_engagement": self._citizen_engagement_data,
            "tourism": self._tourism_data,
        }

    def get_domain_data(self, domain: Optional[str] = None):
        if domain and domain in self.domains:
            return self.domains[domain]()
        all_data = []
        for gen in self.domains.values():
            all_data.extend(gen()[:10])
        return all_data

    def get_summary_metrics(self):
        return [
            {"domain": "mobility", "metric_name": "Avg Commute Time (min)", "current_value": 28, "previous_value": 32, "change_percent": -12.5, "trend": "improving", "status": "good"},
            {"domain": "public_safety", "metric_name": "Response Time (min)", "current_value": 6.2, "previous_value": 7.8, "change_percent": -20.5, "trend": "improving", "status": "good"},
            {"domain": "healthcare", "metric_name": "Avg Wait Time (min)", "current_value": 18, "previous_value": 25, "change_percent": -28.0, "trend": "improving", "status": "good"},
            {"domain": "environment", "metric_name": "AQI", "current_value": 42, "previous_value": 52, "change_percent": -19.2, "trend": "improving", "status": "good"},
            {"domain": "energy", "metric_name": "Consumption (MWh)", "current_value": 2840, "previous_value": 3100, "change_percent": -8.4, "trend": "improving", "status": "good"},
            {"domain": "education", "metric_name": "Graduation Rate (%)", "current_value": 87, "previous_value": 82, "change_percent": 6.1, "trend": "improving", "status": "good"},
            {"domain": "citizen_engagement", "metric_name": "Satisfaction Score", "current_value": 78, "previous_value": 72, "change_percent": 8.3, "trend": "improving", "status": "good"},
            {"domain": "tourism", "metric_name": "Visitor Spending ($M)", "current_value": 145, "previous_value": 128, "change_percent": 13.3, "trend": "improving", "status": "good"},
        ]

    def _base_timeseries(self, base_value: float, variance: float, days: int = 90) -> list[dict]:
        data = []
        for i in range(days):
            date = datetime.now(timezone.utc) - timedelta(days=days - i - 1)
            data.append({
                "timestamp": date.isoformat(),
                "value": round(base_value + random.uniform(-variance, variance), 2),
            })
        return data

    def _mobility_data(self):
        types = ["traffic_volume", "transit_ridership", "avg_speed", "road_incidents", "ev_charging_sessions"]
        data = []
        for t in types:
            for d in self._base_timeseries(500, 100):
                d["category"] = t
                d["location"] = random.choice(["Downtown", "Suburbs", "Industrial Zone", "Residential"])
                d["metric"] = t
                data.append(d)
        return data

    def _public_safety_data(self):
        types = ["emergency_calls", "response_time", "crime_reports", "fire_incidents", "patrol_hours"]
        data = []
        for t in types:
            base = {"emergency_calls": 50, "response_time": 8, "crime_reports": 15, "fire_incidents": 5, "patrol_hours": 200}
            for d in self._base_timeseries(base.get(t, 50), base.get(t, 50) * 0.3):
                d["category"] = t
                d["district"] = random.choice(["District A", "District B", "District C", "District D"])
                d["metric"] = t
                data.append(d)
        return data

    def _healthcare_data(self):
        types = ["patient_visits", "bed_occupancy", "telehealth_sessions", "vaccinations", "emergency_wait"]
        data = []
        for t in types:
            base = {"patient_visits": 200, "bed_occupancy": 75, "telehealth_sessions": 120, "vaccinations": 300, "emergency_wait": 25}
            for d in self._base_timeseries(base.get(t, 100), base.get(t, 100) * 0.2):
                d["category"] = t
                d["facility"] = random.choice(["General Hospital", "Community Clinic", "Urgent Care", "Health Center"])
                d["metric"] = t
                data.append(d)
        return data

    def _environment_data(self):
        types = ["air_quality", "water_quality", "recycling_rate", "green_space", "carbon_emissions"]
        data = []
        for t in types:
            base = {"air_quality": 50, "water_quality": 85, "recycling_rate": 55, "green_space": 25, "carbon_emissions": 400}
            for d in self._base_timeseries(base.get(t, 50), base.get(t, 50) * 0.15):
                d["category"] = t
                d["station"] = random.choice(["Station North", "Station South", "Station East", "Station West"])
                d["metric"] = t
                data.append(d)
        return data

    def _energy_data(self):
        types = ["consumption", "solar_output", "grid_load", "efficiency_score", "peak_demand"]
        data = []
        for t in types:
            base = {"consumption": 3000, "solar_output": 500, "grid_load": 2500, "efficiency_score": 75, "peak_demand": 3500}
            for d in self._base_timeseries(base.get(t, 1000), base.get(t, 1000) * 0.15):
                d["category"] = t
                d["zone"] = random.choice(["Zone 1", "Zone 2", "Zone 3", "Zone 4"])
                d["metric"] = t
                data.append(d)
        return data

    def _education_data(self):
        types = ["enrollment", "test_scores", "graduation_rate", "attendance", "program_participation"]
        data = []
        for t in types:
            base = {"enrollment": 500, "test_scores": 78, "graduation_rate": 85, "attendance": 92, "program_participation": 150}
            for d in self._base_timeseries(base.get(t, 100), base.get(t, 100) * 0.1):
                d["category"] = t
                d["school"] = random.choice(["Elementary", "Middle School", "High School", "Community College"])
                d["metric"] = t
                data.append(d)
        return data

    def _citizen_engagement_data(self):
        types = ["digital_platform_usage", "satisfaction_score", "service_requests", "meeting_attendance", "feedback_submissions"]
        data = []
        for t in types:
            base = {"digital_platform_usage": 1000, "satisfaction_score": 72, "service_requests": 200, "meeting_attendance": 80, "feedback_submissions": 150}
            for d in self._base_timeseries(base.get(t, 100), base.get(t, 100) * 0.2):
                d["category"] = t
                d["channel"] = random.choice(["Web", "Mobile", "In-Person", "Phone"])
                d["metric"] = t
                data.append(d)
        return data

    def _tourism_data(self):
        types = ["visitor_count", "hotel_occupancy", "local_spending", "attraction_visits", "event_attendance"]
        data = []
        for t in types:
            base = {"visitor_count": 5000, "hotel_occupancy": 72, "local_spending": 200000, "attraction_visits": 3000, "event_attendance": 800}
            for d in self._base_timeseries(base.get(t, 1000), base.get(t, 1000) * 0.2):
                d["category"] = t
                d["district"] = random.choice(["Historic District", "Waterfront", "City Center", "Cultural Quarter"])
                d["metric"] = t
                data.append(d)
        return data

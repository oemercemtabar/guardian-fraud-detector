from fastapi.testclient import TestClient

from app.main import app


def test_health_check(client):
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    body = response.json()

    assert body["status"] == "ok"
    assert body["service"] == "guardian-backend"
    assert "model_status" in body
    assert "model_version" in body
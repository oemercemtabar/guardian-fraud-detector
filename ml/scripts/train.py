from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parents[2]
ARTIFACTS_DIR = ROOT / "backend" / "app" / "ml" / "artifacts"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)


def build_synthetic_dataset(n_samples: int = 5000) -> pd.DataFrame:
    rng = np.random.default_rng(42)

    amounts = rng.gamma(shape=2.0, scale=1200.0, size=n_samples)
    is_international = rng.integers(0, 2, size=n_samples)
    card_present = rng.integers(0, 2, size=n_samples)
    hour_of_day = rng.integers(0, 24, size=n_samples)
    account_age_days = rng.integers(0, 3650, size=n_samples)
    previous_failed_transactions_24h = rng.poisson(0.8, size=n_samples)

    payment_method = rng.choice(["card", "bank_transfer", "wallet", "crypto"], size=n_samples)
    device_type = rng.choice(["mobile", "desktop", "tablet", "pos"], size=n_samples)
    currency = rng.choice(["EUR", "USD", "GBP"], size=n_samples)
    country = rng.choice(["IT", "US", "GB", "DE", "FR"], size=n_samples)

    df = pd.DataFrame(
        {
            "amount": amounts,
            "is_international": is_international,
            "card_present": card_present,
            "hour_of_day": hour_of_day,
            "account_age_days": account_age_days,
            "previous_failed_transactions_24h": previous_failed_transactions_24h,
            "payment_method": payment_method,
            "device_type": device_type,
            "currency": currency,
            "country": country,
        }
    )

    fraud_score = (
        (df["amount"] > 5000).astype(int) * 2.2
        + (df["is_international"] == 1).astype(int) * 1.5
        + (df["card_present"] == 0).astype(int) * 1.4
        + (df["previous_failed_transactions_24h"] >= 3).astype(int) * 2.0
        + (df["hour_of_day"] <= 5).astype(int) * 0.8
        + (df["payment_method"] == "crypto").astype(int) * 0.8
        + ((df["device_type"] == "mobile") & (df["is_international"] == 1)).astype(int) * 0.6
    )

    fraud_probability = 1 / (1 + np.exp(-(fraud_score - 3.5)))
    y = rng.binomial(1, fraud_probability)

    df["target"] = y
    return df


def train():
    df = build_synthetic_dataset()

    X = df.drop(columns=["target"])
    y = df["target"]

    X_encoded = pd.get_dummies(
        X,
        columns=["payment_method", "device_type", "currency", "country"],
        drop_first=False,
    )

    feature_columns = X_encoded.columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=250,
        max_depth=10,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    probabilities = model.predict_proba(X_test)[:, 1]
    predictions = (probabilities >= 0.5).astype(int)

    print("ROC-AUC:", round(roc_auc_score(y_test, probabilities), 4))
    print(classification_report(y_test, predictions))

    joblib.dump(model, ARTIFACTS_DIR / "fraud_model.joblib")
    joblib.dump(feature_columns, ARTIFACTS_DIR / "feature_columns.joblib")

    print(f"Saved model to: {ARTIFACTS_DIR / 'fraud_model.joblib'}")
    print(f"Saved feature columns to: {ARTIFACTS_DIR / 'feature_columns.joblib'}")


if __name__ == "__main__":
    train()
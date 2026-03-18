import pandas as pd

from app.schemas.transaction import TransactionRequest


def build_model_input(payload: TransactionRequest, feature_columns: list[str]) -> pd.DataFrame:
    raw = {
        "amount": payload.amount,
        "is_international": int(payload.is_international),
        "card_present": int(payload.card_present),
        "hour_of_day": payload.hour_of_day,
        "account_age_days": payload.account_age_days,
        "previous_failed_transactions_24h": payload.previous_failed_transactions_24h,
        "payment_method": payload.payment_method.value,
        "device_type": payload.device_type.value,
        "currency": payload.currency,
        "country": payload.country,
    }

    df = pd.DataFrame([raw])

    df_encoded = pd.get_dummies(
        df,
        columns=["payment_method", "device_type", "currency", "country"],
        drop_first=False,
    )

    df_aligned = df_encoded.reindex(columns=feature_columns, fill_value=0)
    return df_aligned
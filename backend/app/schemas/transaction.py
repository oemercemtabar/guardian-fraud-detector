from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, field_validator

class PaymentMethod(str, Enum):
    card = "card"
    bank_transfer = "bank_transfer"
    wallet = "wallet"
    crypto = "crypto"

class DeviceType(str, Enum):
    mobile = "mobile"
    desktop = "desktop"
    tablet = "tablet"
    pos = "pos"

class TransactionRequest(BaseModel):

    transaction_id: str = Field(..., min_length=3, max_length=64)
    customer_id: str = Field(..., min_length=3, max_length=64)
    merchant_id: str = Field(..., min_length=3, max_length=64)

    amount: float = Field(..., gt=0)
    currency: str = Field(..., min_length=3, max_length=3)
    country: str = Field(..., min_length=2, max_length=2)

    payment_method: PaymentMethod
    device_type: DeviceType

    timestamp: datetime
    is_international: bool
    card_present: bool

    hour_of_day: int = Field(..., ge=0, le=23)
    account_age_days: int = Field(..., ge=0)
    previous_failed_transactions_24h: int = Field(..., ge=0)

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, value: str) -> str:
        value = value.upper()
        if not value.isalpha():
            raise ValueError("currency must contain only letters")
        return value

    @field_validator("country")
    @classmethod
    def validate_country(cls, value: str) -> str:
        value = value.upper()
        if not value.isalpha():
            raise ValueError("country must contain only letters")
        return value
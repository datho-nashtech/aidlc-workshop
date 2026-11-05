export type Role = "player" | "owner";
export type FieldStatus = "active" | "inactive";
export type SlotStatus = "free" | "held";
export type BookingStatus = "pending" | "confirmed";
export type PaymentStatus = "unpaid" | "paid";

export type User = {
  id: string;
  email: string;
  passwordSecret: string;
  fullName: string;
  role: Role;
};

export type Field = {
  id: string;
  name: string;
  price: number;
  status: FieldStatus;
};

export type Slot = {
  id: string;
  fieldId: string;
  startAt: string;
  status: SlotStatus;
};

export type Booking = {
  id: string;
  userId: string;
  fieldId: string;
  slotId: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  confirmationRef: string | null;
  createdByUserId: string;
};

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

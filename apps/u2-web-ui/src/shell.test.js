import { describe, expect, it, vi } from "vitest";
import { SLOT_TAKEN_MESSAGE } from "./api.js";
import {
  confirmationCopy,
  handleBookConflict,
  navItems,
  ownerNavVisible,
  validateEmail,
  validatePrice,
  validateSlot,
} from "./shell.js";

describe("shell and booking UI", () => {
  it("hides owner nav for anonymous", () => {
    expect(ownerNavVisible(null)).toBe(false);
    expect(navItems(null).some((i) => i.id.startsWith("owner"))).toBe(false);
  });

  it("hides owner nav for player", () => {
    expect(ownerNavVisible("player")).toBe(false);
    expect(navItems("player").map((i) => i.id)).not.toContain("owner-fields");
  });

  it("shows owner tools only for owner", () => {
    expect(ownerNavVisible("owner")).toBe(true);
    expect(navItems("owner").map((i) => i.id)).toEqual(
      expect.arrayContaining(["owner-fields", "owner-bookings", "browse"]),
    );
  });

  it("409 path shows taken and refreshes without retry POST", () => {
    const refreshSlots = vi.fn();
    const result = handleBookConflict({ status: 409 }, { refreshSlots });
    expect(result).toEqual({ shown: true, message: SLOT_TAKEN_MESSAGE, retried: false });
    expect(refreshSlots).toHaveBeenCalledTimes(1);
  });

  it("throws if a retry POST is supplied on 409", () => {
    expect(() => handleBookConflict({ status: 409 }, { refreshSlots: () => {}, retryPost: () => {} })).toThrow(
      /must not retry/,
    );
  });

  it("confirmation page uses confirmationRef from GET booking", () => {
    expect(confirmationCopy({ confirmationRef: "CNF-1", status: "confirmed" })).toBe("CNF-1");
    expect(confirmationCopy({ confirmationRef: null, status: "pending" })).toBe("pending");
  });

  it("validates email, price, and slot before submit", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("owner@venue.local")).toBe(true);
    expect(validatePrice(0)).toBe(false);
    expect(validatePrice(10)).toBe(true);
    expect(validateSlot("")).toBe(false);
    expect(validateSlot("slot-1")).toBe(true);
  });
});

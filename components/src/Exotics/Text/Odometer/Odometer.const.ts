import type { OdometerMechanism } from "./Odometer.types";

export const ODOMETER_DEFAULTS = {
    cascadeDelayMs: 90,
    turnDurationMs: 600,
    mechanism: "drum" as OdometerMechanism,
};

import type { StepperOrientation } from "./Stepper.types";

export const STEPPER_DEFAULTS = {
    orientation: "horizontal" as StepperOrientation,
    gap: 0,
};

export const STEPPER_ORIENTATIONS: readonly StepperOrientation[] = ["horizontal", "vertical"];

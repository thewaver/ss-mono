import type { WheelSpinStyleKey } from "../Pages/Wheels/Wheels.types";

export namespace WheelKnobs {
    export const MIN_WEDGE_COUNT = 2;
    export const MAX_WEDGE_COUNT = 12;
    export const WEDGE_COUNT_STEP = 1;
    export const MIN_DURATION_MS = 500;
    export const MAX_DURATION_MS = 6000;
    export const DURATION_STEP_MS = 500;
    export const MIN_TURNS = 1;
    export const MAX_TURNS = 10;
    export const TURNS_STEP = 1;
    export const MIN_IDLE_DELAY_MS = 1000;
    export const MAX_IDLE_DELAY_MS = 8000;
    export const IDLE_DELAY_STEP_MS = 500;

    export const STARTING_WEDGE_COUNT = 8;
    export const STARTING_SPIN_DURATION_MS = 3000;
    export const STARTING_SETTLE_DURATION_MS = 1500;
    export const STARTING_REST_DURATION_MS = 3000;
    export const STARTING_IDLE_DELAY_MS = 3000;
    export const STARTING_TURNS = 3;
    export const STARTING_SPIN_STYLE_KEY: WheelSpinStyleKey = "bouncy";
    export const STARTING_DOES_RESUME = true;
    export const STARTING_IS_IDLING_ALLOWED = true;
    export const STARTING_IS_DISABLED = false;
}

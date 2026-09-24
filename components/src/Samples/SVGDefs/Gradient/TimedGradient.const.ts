import type { TimedGradientDefaultsByFamily } from "../SVGDefs.types";

const DEFAULT_STEP_COUNT = 12;
const TWO_COLOR_FLOW_DEFAULTS = { steps: DEFAULT_STEP_COUNT, bands: 3 };
const THREE_COLOR_FLOW_DEFAULTS = { steps: DEFAULT_STEP_COUNT, bands: 2 };

export namespace TimedGradientDefaults {
    export const STEPS_DEFAULT = { steps: DEFAULT_STEP_COUNT };

    export const DEFAULTS_BY_FAMILY: TimedGradientDefaultsByFamily = {
        elastic_circle_1: {},
        elastic_drip_1: {},
        elastic_inter_semicircle_1: {},
        elastic_semicircle_1: {},
        fill_2c: {},
        fill_3c: {},
        fill_diag_2v2c: {},
        flow_2: TWO_COLOR_FLOW_DEFAULTS,
        flow_3: THREE_COLOR_FLOW_DEFAULTS,
        flow_diag_2: TWO_COLOR_FLOW_DEFAULTS,
        flow_diag_3: THREE_COLOR_FLOW_DEFAULTS,
        merge_1v1: {},
        merge_diag_1v1: {},
        merge_diag_async_4: {},
        orbit_1: STEPS_DEFAULT,
        orbit_1v1: STEPS_DEFAULT,
        orbit_async_2v1: STEPS_DEFAULT,
        orbit_async_3: STEPS_DEFAULT,
        scan_1: {},
        scan_1v1: {},
        scan_diag_1: {},
        scan_diag_1v1: {},
        snake_1: STEPS_DEFAULT,
        snake_1v1: STEPS_DEFAULT,
        snake_2: STEPS_DEFAULT,
        snake_4: STEPS_DEFAULT,
        snake_async_3: STEPS_DEFAULT,
        snake_inter_2: STEPS_DEFAULT,
        sweep_1: {},
        sweep_1v1: {},
        sweep_diag_1: {},
        sweep_diag_1v1: {},
        sweep_diag_async_4: {},
    };
}

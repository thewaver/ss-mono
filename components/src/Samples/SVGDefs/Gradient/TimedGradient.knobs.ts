import type { SampleCheckKnob, SampleNumberKnob } from "../../Samples.types";

const CYCLES_KNOB: SampleCheckKnob = { kind: "check", label: "Cycle the colours" };
const BANDED_KNOB: SampleCheckKnob = { kind: "check", label: "Solid bands rather than a blend" };
const STEPS_KNOB: SampleNumberKnob = { kind: "number", label: "Keyframes per turn", min: 4, max: 36, step: 2 };
const BANDS_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Colour repeats across the strip",
    min: 1,
    max: 16,
    step: 1,
};

const STEPS_DEFAULT = { steps: 12 };
const TWO_COLOUR_FLOW_DEFAULTS = { ...STEPS_DEFAULT, bands: 3 };
const THREE_COLOUR_FLOW_DEFAULTS = { ...STEPS_DEFAULT, bands: 2 };

export namespace TimedGradientKnobs {
    export const KNOBS_BY_FAMILY = {
        elastic_circle_1: { cycles: CYCLES_KNOB },
        elastic_drip_1: { cycles: CYCLES_KNOB },
        elastic_inter_semicircle_1: { cycles: CYCLES_KNOB },
        elastic_semicircle_1: { cycles: CYCLES_KNOB },
        fill_2c: {},
        fill_3c: {},
        fill_diag_2v2c: {},
        flow_2: { cycles: CYCLES_KNOB, banded: BANDED_KNOB, bands: BANDS_KNOB },
        flow_3: { cycles: CYCLES_KNOB, banded: BANDED_KNOB, bands: BANDS_KNOB },
        flow_diag_2: { cycles: CYCLES_KNOB, banded: BANDED_KNOB, bands: BANDS_KNOB },
        flow_diag_3: { cycles: CYCLES_KNOB, banded: BANDED_KNOB, bands: BANDS_KNOB },
        merge_1v1: { cycles: CYCLES_KNOB },
        merge_diag_1v1: { cycles: CYCLES_KNOB },
        merge_diag_async_4: {},
        orbit_1: { cycles: CYCLES_KNOB, steps: STEPS_KNOB },
        orbit_1v1: { cycles: CYCLES_KNOB, steps: STEPS_KNOB },
        orbit_async_2v1: { steps: STEPS_KNOB },
        orbit_async_3: { steps: STEPS_KNOB },
        scan_1: { cycles: CYCLES_KNOB },
        scan_1v1: { cycles: CYCLES_KNOB },
        scan_diag_1: { cycles: CYCLES_KNOB },
        scan_diag_1v1: { cycles: CYCLES_KNOB },
        snake_1: { cycles: CYCLES_KNOB, steps: STEPS_KNOB },
        snake_1v1: { cycles: CYCLES_KNOB, steps: STEPS_KNOB },
        snake_2: { cycles: CYCLES_KNOB, steps: STEPS_KNOB },
        snake_4: { cycles: CYCLES_KNOB, steps: STEPS_KNOB },
        snake_async_3: { steps: STEPS_KNOB },
        snake_inter_2: { cycles: CYCLES_KNOB, steps: STEPS_KNOB },
        sweep_1: { cycles: CYCLES_KNOB },
        sweep_1v1: { cycles: CYCLES_KNOB },
        sweep_diag_1: { cycles: CYCLES_KNOB },
        sweep_diag_1v1: { cycles: CYCLES_KNOB },
        sweep_diag_async_4: { cycles: CYCLES_KNOB },
    };

    export const DEFAULTS_BY_FAMILY: Record<string, Record<string, number>> = {
        elastic_circle_1: {},
        elastic_drip_1: {},
        elastic_inter_semicircle_1: {},
        elastic_semicircle_1: {},
        fill_2c: {},
        fill_3c: {},
        fill_diag_2v2c: {},
        flow_2: TWO_COLOUR_FLOW_DEFAULTS,
        flow_3: THREE_COLOUR_FLOW_DEFAULTS,
        flow_diag_2: TWO_COLOUR_FLOW_DEFAULTS,
        flow_diag_3: THREE_COLOUR_FLOW_DEFAULTS,
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

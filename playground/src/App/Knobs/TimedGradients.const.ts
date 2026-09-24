import type { TimedGradientDefsOf, TimedGradientFamily } from "@thewaver/ss-components";

import type { CheckKnob, Knobs, NumberKnob } from "../PageComponents/Knobs/Knobs.types";

const CYCLES_KNOB: CheckKnob = {
    kind: "check",
    label: "Cycle color",
    hint: "Walks the gradient through the sample's colors as it animates, instead of holding the one it starts on.",
};
const BANDED_KNOB: CheckKnob = {
    kind: "check",
    label: "Banded",
    hint: "Draws the flow as hard-edged stripes instead of one smooth blend.",
};
const STEPS_KNOB: NumberKnob = {
    kind: "number",
    label: "Steps",
    hint: "How many stops the movement is cut into. More steps make the run smoother and cost more to draw.",
    min: 4,
    max: 36,
    step: 2,
};
const BANDS_KNOB: NumberKnob = {
    kind: "number",
    label: "Bands",
    hint: "How many times the colors repeat across the gradient. More bands make a tighter stripe.",
    min: 1,
    max: 16,
    step: 1,
};

export namespace TimedGradientKnobs {
    export const KNOBS_BY_FAMILY: { [F in TimedGradientFamily]: Knobs<TimedGradientDefsOf<F>> } = {
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
}

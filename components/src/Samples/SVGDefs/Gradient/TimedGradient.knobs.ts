import type { SampleCheckKnob, SampleKnobs, SampleNumberKnob } from "../../Samples.types";
import type { TimedGradientEntry, TimedGradientFamily } from "../SVGDefs.types";

/**
 * The options a Timed gradient family takes, read off the registry's own entry for it.
 *
 * The entry union is what already pairs a family with its `Gradient*Opts`, so deriving from it means a
 * renamed option breaks the knob map rather than silently describing a knob nothing reads. A family that
 * takes no options answers an empty type, which only an empty knob set satisfies.
 */
type TimedGradientDefsOf<F extends TimedGradientFamily> =
    Extract<TimedGradientEntry, { family: F }> extends { defs?: infer TDefs } ? NonNullable<TDefs> : object;

/** A knob set per family, each checked against that family's own options. */
type TimedGradientKnobsByFamily = { [F in TimedGradientFamily]: SampleKnobs<TimedGradientDefsOf<F>> };

/** The starting values per family, each checked against that family's own options. */
type TimedGradientDefaultsByFamily = { [F in TimedGradientFamily]: Partial<TimedGradientDefsOf<F>> };

const CYCLES_KNOB: SampleCheckKnob = {
    kind: "check",
    label: "Cycle color",
    hint: "Walks the gradient through the sample's colors as it animates, instead of holding the one it starts on.",
};
const BANDED_KNOB: SampleCheckKnob = {
    kind: "check",
    label: "Banded",
    hint: "Draws the flow as hard-edged stripes instead of one smooth blend.",
};
const STEPS_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Steps",
    hint: "How many stops the movement is cut into. More steps make the run smoother and cost more to draw.",
    min: 4,
    max: 36,
    step: 2,
};
const BANDS_KNOB: SampleNumberKnob = {
    kind: "number",
    label: "Bands",
    hint: "How many times the colors repeat across the gradient. More bands make a tighter stripe.",
    min: 1,
    max: 16,
    step: 1,
};

const DEFAULT_STEP_COUNT = 12;
const TWO_COLOR_FLOW_DEFAULTS = { steps: DEFAULT_STEP_COUNT, bands: 3 };
const THREE_COLOR_FLOW_DEFAULTS = { steps: DEFAULT_STEP_COUNT, bands: 2 };

export namespace TimedGradientKnobs {
    export const STEPS_DEFAULT = { steps: DEFAULT_STEP_COUNT };

    export const KNOBS_BY_FAMILY: TimedGradientKnobsByFamily = {
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

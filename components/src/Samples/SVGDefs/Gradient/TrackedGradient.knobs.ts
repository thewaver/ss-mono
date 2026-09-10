import type { SampleCheckKnob } from "../../Samples.types";

const CYCLES_KNOB: SampleCheckKnob = { kind: "check", label: "Cycle the colours" };

export namespace TrackedGradientKnobs {
    export const KNOBS_BY_FAMILY = {
        band_1: {},
        band_1v1: {},
        band_diag_1: {},
        hand_1: {},
        hand_trail_1: {},
        hand_trail_2: { cycles: CYCLES_KNOB },
        hand_trail_3: { cycles: CYCLES_KNOB },
        spot_1: {},
        spot_flare_2: {},
        spot_flare_3: {},
        spot_ripple_1: {},
        spot_ripple_2: { cycles: CYCLES_KNOB },
        spot_ripple_3: { cycles: CYCLES_KNOB },
        spot_smear_2: { cycles: CYCLES_KNOB },
        spot_smear_3: { cycles: CYCLES_KNOB },
        spot_trail_1: {},
        spot_trail_2: { cycles: CYCLES_KNOB },
        spot_trail_3: { cycles: CYCLES_KNOB },
    };
}

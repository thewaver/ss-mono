import type { SampleCheckKnob } from "../../Samples.types";

const CYCLES_KNOB: SampleCheckKnob = { kind: "check", label: "Cycle the colours" };
const BANDED_KNOB: SampleCheckKnob = { kind: "check", label: "Solid bands rather than a blend" };

export namespace TimedGradientKnobs {
    export const KNOBS_BY_FAMILY = {
        elastic_circle_1: { cycles: CYCLES_KNOB },
        elastic_drip_1: { cycles: CYCLES_KNOB },
        elastic_inter_semicircle_1: { cycles: CYCLES_KNOB },
        elastic_semicircle_1: { cycles: CYCLES_KNOB },
        fill_2c: {},
        fill_3c: {},
        fill_diag_2v2c: {},
        flow_2: { cycles: CYCLES_KNOB, banded: BANDED_KNOB },
        flow_3: { cycles: CYCLES_KNOB, banded: BANDED_KNOB },
        flow_diag_2: { cycles: CYCLES_KNOB, banded: BANDED_KNOB },
        flow_diag_3: { cycles: CYCLES_KNOB, banded: BANDED_KNOB },
        merge_1v1: { cycles: CYCLES_KNOB },
        merge_diag_1v1: { cycles: CYCLES_KNOB },
        merge_diag_async_4: {},
        orbit_1: { cycles: CYCLES_KNOB },
        orbit_1v1: { cycles: CYCLES_KNOB },
        orbit_async_2v1: {},
        orbit_async_3: {},
        scan_1: { cycles: CYCLES_KNOB },
        scan_1v1: { cycles: CYCLES_KNOB },
        scan_diag_1: { cycles: CYCLES_KNOB },
        scan_diag_1v1: { cycles: CYCLES_KNOB },
        snake_1: { cycles: CYCLES_KNOB },
        snake_1v1: { cycles: CYCLES_KNOB },
        snake_2: { cycles: CYCLES_KNOB },
        snake_4: { cycles: CYCLES_KNOB },
        snake_async_3: {},
        snake_inter_2: { cycles: CYCLES_KNOB },
        sweep_1: { cycles: CYCLES_KNOB },
        sweep_1v1: { cycles: CYCLES_KNOB },
        sweep_diag_1: { cycles: CYCLES_KNOB },
        sweep_diag_1v1: { cycles: CYCLES_KNOB },
        sweep_diag_async_4: { cycles: CYCLES_KNOB },
    };
}

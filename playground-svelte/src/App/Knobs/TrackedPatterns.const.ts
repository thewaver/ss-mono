import type { TrackedPatternDefsOf, TrackedPatternFamily } from "@thewaver/ss-components-svelte";

import type { CheckKnob, Knobs, NumberKnob } from "../PageComponents/Knobs/Knobs.types";

const TILED_KNOB: CheckKnob = {
    kind: "check",
    label: "Tiled",
    hint: "Repeats one fixed tile and lets every copy react at once, instead of drawing one tile across the whole shape. Cheaper on a large shape with small cells, but the pointer lights the same spot in every copy.",
};
const REACH_KNOB: NumberKnob = {
    kind: "number",
    label: "Reach (cells)",
    hint: "How many cells away from the pointer a cell still reacts.",
    min: 0.5,
    max: 10,
    step: 0.5,
};
const GROW_REST_LEVEL_KNOB: NumberKnob = {
    kind: "number",
    label: "Rest size",
    hint: "How large a cell is with the pointer out of reach, against its full size.",
    min: 0,
    max: 1,
    step: 0.05,
};
const FADE_REST_LEVEL_KNOB: NumberKnob = {
    kind: "number",
    label: "Rest opacity",
    hint: "How opaque a cell is with the pointer out of reach.",
    min: 0,
    max: 1,
    step: 0.05,
};

const TRAIL_KNOB: NumberKnob = {
    kind: "number",
    label: "Trail (ms)",
    hint: "How long a cell keeps glowing after the pointer has passed, fading on its own. 0 leaves no trail.",
    min: 0,
    max: 3000,
    step: 100,
};

const RETENTION_KNOB: NumberKnob = {
    kind: "number",
    label: "Retention (ms)",
    hint: "How long a cell stays where the pointer left it before its trail starts to fade. Moving back over it lights it again at once.",
    min: 0,
    max: 3000,
    step: 100,
};

const GROW_KNOBS = {
    tiled: TILED_KNOB,
    reach: REACH_KNOB,
    restLevel: GROW_REST_LEVEL_KNOB,
    trailMs: TRAIL_KNOB,
    retentionMs: RETENTION_KNOB,
};
const FADE_KNOBS = {
    tiled: TILED_KNOB,
    reach: REACH_KNOB,
    restLevel: FADE_REST_LEVEL_KNOB,
    trailMs: TRAIL_KNOB,
    retentionMs: RETENTION_KNOB,
};

export namespace TrackedPatternKnobs {
    export const KNOBS_BY_FAMILY: { [F in TrackedPatternFamily]: Knobs<TrackedPatternDefsOf<F>> } = {
        circle_g_grow_2: GROW_KNOBS,
        circle_hd_grow_2: GROW_KNOBS,
        circle_hs_grow_2: GROW_KNOBS,
        hexagon_ft_fade_2: FADE_KNOBS,
        hexagon_pt_fade_2: FADE_KNOBS,
        lozenge_d_fade_2: FADE_KNOBS,
        triangle_s_fade_2: FADE_KNOBS,
        triangle_t_fade_2: FADE_KNOBS,
        square_g_trail_2: FADE_KNOBS,
        hexagon_pt_trail_2: FADE_KNOBS,
        triangle_t_trail_2: FADE_KNOBS,
    };
}

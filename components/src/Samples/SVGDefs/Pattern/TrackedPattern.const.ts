import type { TrackedPatternDefaultsByFamily } from "../SVGDefs.types";

export namespace TrackedPatternDefaults {
    export const GROW_DEFAULTS = { tiled: false, reach: 3, restLevel: 0.15, fadeDurationMs: 0, fadeDelayMs: 0 };

    export const FADE_DEFAULTS = { tiled: false, reach: 3, restLevel: 0.1, fadeDurationMs: 0, fadeDelayMs: 0 };

    export const TRAIL_DEFAULTS = { tiled: false, reach: 1, restLevel: 0, fadeDurationMs: 700, fadeDelayMs: 0 };

    export const DEFAULTS_BY_FAMILY: TrackedPatternDefaultsByFamily = {
        circle_g_grow_2: GROW_DEFAULTS,
        circle_hd_grow_2: GROW_DEFAULTS,
        circle_hs_grow_2: GROW_DEFAULTS,
        hexagon_ft_fade_2: FADE_DEFAULTS,
        hexagon_pt_fade_2: FADE_DEFAULTS,
        lozenge_d_fade_2: FADE_DEFAULTS,
        triangle_s_fade_2: FADE_DEFAULTS,
        triangle_t_fade_2: FADE_DEFAULTS,
        square_g_trail_2: TRAIL_DEFAULTS,
        hexagon_pt_trail_2: TRAIL_DEFAULTS,
        triangle_t_trail_2: TRAIL_DEFAULTS,
    };
}

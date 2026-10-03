import type { TrackedPatternDefaultsByFamily } from "../SVGDefs.types";

export namespace TrackedPatternDefaults {
    export const GROW_DEFAULTS = { tiled: false, reach: 3, restLevel: 0.15 };

    export const FADE_DEFAULTS = { tiled: false, reach: 3, restLevel: 0.1 };

    export const DEFAULTS_BY_FAMILY: TrackedPatternDefaultsByFamily = {
        circle_g_grow_2: GROW_DEFAULTS,
        circle_hd_grow_2: GROW_DEFAULTS,
        circle_hs_grow_2: GROW_DEFAULTS,
        hexagon_ft_fade_2: FADE_DEFAULTS,
        hexagon_pt_fade_2: FADE_DEFAULTS,
        lozenge_d_fade_2: FADE_DEFAULTS,
        triangle_s_fade_2: FADE_DEFAULTS,
        triangle_t_fade_2: FADE_DEFAULTS,
    };
}

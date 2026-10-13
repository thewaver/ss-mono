import { constant } from "./Iteration/constant";
import { repeat1_1 } from "./Iteration/repeat1_1";
import { repeat2_1 } from "./Iteration/repeat2_1";
import { repeat3_3 } from "./Iteration/repeat3_3";
import type {
    IterationConfig,
    SVGDefsColors,
    TimedGradientEntry,
    TrackedGradientEntry,
    TrackedPatternEntry,
} from "./SVGDefs.types";

const TIMED_PATTERN_SAMPLE_KEYS = [
    "circle_g_2",
    "circle_hd_2",
    "circle_hs_2",
    "hexagon_ft_2",
    "hexagon_pt_2",
    "lozenge_d_2",
    "triangle_s_2",
    "triangle_t_2",
    "triangle_ltr_2",
    "triangle_rtl_2",
    "triangle_sq_2",
    "triangle_lq_2",
    "whirl_2",
    "whirl_curved_2",
] as const;

export namespace SVGDefsSamples {
    export const SAMPLE_COLORS: SVGDefsColors = {
        background: "#282420",
        primary: "#FFFF00",
        secondary: "#00FFFF",
        tertiary: "#FF00FF",
    };

    export const SAMPLE_COLORS_MONO: SVGDefsColors = {
        background: "#282420",
        primary: "#F0F4F8",
        secondary: "#D0D4D8",
        tertiary: "#B0B4B8",
    };

    export namespace Iteration {
        export const SAMPLE_CONFIGS = {
            constant,
            repeat1_1,
            repeat2_1,
            repeat3_3,
        } as const satisfies Record<string, IterationConfig>;

        export type SampleKey = keyof typeof SAMPLE_CONFIGS;

        export const SAMPLE_KEYS = Object.keys(SAMPLE_CONFIGS) as SampleKey[];
    }

    export namespace Pattern {
        export namespace Timed {
            export type SampleKey = (typeof TIMED_PATTERN_SAMPLE_KEYS)[number];

            export const SAMPLE_KEYS: SampleKey[] = [...TIMED_PATTERN_SAMPLE_KEYS];
        }

        export namespace Tracked {
            export const SAMPLE_ENTRIES = {
                circle_g_grow_2: { family: "circle_g_grow_2" },
                circle_hd_grow_2: { family: "circle_hd_grow_2" },
                circle_hs_grow_2: { family: "circle_hs_grow_2" },
                hexagon_ft_fade_2: { family: "hexagon_ft_fade_2" },
                hexagon_pt_fade_2: { family: "hexagon_pt_fade_2" },
                lozenge_d_fade_2: { family: "lozenge_d_fade_2" },
                triangle_s_fade_2: { family: "triangle_s_fade_2" },
                triangle_t_fade_2: { family: "triangle_t_fade_2" },
                triangle_ltr_fade_2: { family: "triangle_ltr_fade_2" },
                triangle_rtl_fade_2: { family: "triangle_rtl_fade_2" },
                triangle_sq_fade_2: { family: "triangle_sq_fade_2" },
                triangle_lq_fade_2: { family: "triangle_lq_fade_2" },
                square_g_trail_2: { family: "square_g_trail_2" },
                hexagon_pt_trail_2: { family: "hexagon_pt_trail_2" },
                triangle_t_trail_2: { family: "triangle_t_trail_2" },
            } as const satisfies Record<string, TrackedPatternEntry>;

            export type Entry = TrackedPatternEntry;

            export type SampleKey = keyof typeof SAMPLE_ENTRIES;

            export const SAMPLE_KEYS = Object.keys(SAMPLE_ENTRIES) as SampleKey[];
        }
    }

    export namespace Gradient {
        export namespace Timed {
            export const SAMPLE_ENTRIES = {
                elastic_circle_1: { family: "elastic_circle_1" },
                elastic_drip_1: { family: "elastic_drip_1" },
                elastic_inter_semicircle_1: { family: "elastic_inter_semicircle_1" },
                elastic_semicircle_1: { family: "elastic_semicircle_1" },
                fill_2c: { family: "fill_2c" },
                fill_3c: { family: "fill_3c" },
                fill_diag_2v2c: { family: "fill_diag_2v2c" },
                flow_2: { family: "flow_2" },
                flow_3: { family: "flow_3" },
                flow_diag_2: { family: "flow_diag_2" },
                flow_diag_3: { family: "flow_diag_3" },
                merge_1v1: { family: "merge_1v1" },
                merge_diag_1v1: { family: "merge_diag_1v1" },
                merge_diag_async_4: { family: "merge_diag_async_4" },
                orbit_1: { family: "orbit_1" },
                orbit_1v1: { family: "orbit_1v1" },
                orbit_async_2v1: { family: "orbit_async_2v1" },
                orbit_async_3: { family: "orbit_async_3" },
                scan_1: { family: "scan_1" },
                scan_1v1: { family: "scan_1v1" },
                scan_diag_1: { family: "scan_diag_1" },
                scan_diag_1v1: { family: "scan_diag_1v1" },
                snake_1: { family: "snake_1" },
                snake_1v1: { family: "snake_1v1" },
                snake_2: { family: "snake_2" },
                snake_4: { family: "snake_4" },
                snake_async_3: { family: "snake_async_3" },
                snake_inter_2: { family: "snake_inter_2" },
                sweep_1: { family: "sweep_1" },
                sweep_1v1: { family: "sweep_1v1" },
                sweep_diag_1: { family: "sweep_diag_1" },
                sweep_diag_1v1: { family: "sweep_diag_1v1" },
                sweep_diag_async_4: { family: "sweep_diag_async_4" },
            } as const satisfies Record<string, TimedGradientEntry>;

            export type Entry = TimedGradientEntry;

            export type SampleKey = keyof typeof SAMPLE_ENTRIES;

            export const SAMPLE_KEYS = Object.keys(SAMPLE_ENTRIES) as SampleKey[];
        }

        export namespace Tracked {
            export const SAMPLE_ENTRIES = {
                band_1: { family: "band_1" },
                band_1v1: { family: "band_1v1" },
                band_diag_1: { family: "band_diag_1" },
                hand_1: { family: "hand_1" },
                hand_trail_1: { family: "hand_trail_1" },
                hand_trail_2: { family: "hand_trail_2" },
                hand_trail_3: { family: "hand_trail_3" },
                spot_1: { family: "spot_1" },
                spot_flare_2: { family: "spot_flare_2" },
                spot_flare_3: { family: "spot_flare_3" },
                spot_ripple_1: { family: "spot_ripple_1" },
                spot_ripple_2: { family: "spot_ripple_2" },
                spot_ripple_3: { family: "spot_ripple_3" },
                spot_smear_1: { family: "spot_smear_1" },
                spot_smear_2: { family: "spot_smear_2" },
                spot_smear_3: { family: "spot_smear_3" },
                spot_trail_1: { family: "spot_trail_1" },
                spot_trail_2: { family: "spot_trail_2" },
                spot_trail_3: { family: "spot_trail_3" },
                comet_1: { family: "comet_1" },
                comet_2: { family: "comet_2" },
                comet_3: { family: "comet_3" },
                swarm_1: { family: "swarm_1" },
                swarm_2: { family: "swarm_2" },
                swarm_3: { family: "swarm_3" },
                pixel_trail_1: { family: "pixel_trail_1" },
                pixel_trail_2: { family: "pixel_trail_2" },
                pixel_trail_3: { family: "pixel_trail_3" },
            } as const satisfies Record<string, TrackedGradientEntry>;

            export type Entry = TrackedGradientEntry;

            export type SampleKey = keyof typeof SAMPLE_ENTRIES;

            export const SAMPLE_KEYS = Object.keys(SAMPLE_ENTRIES) as SampleKey[];
        }
    }
}

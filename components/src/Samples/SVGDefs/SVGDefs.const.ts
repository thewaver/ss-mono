import { elastic_circle_1 } from "./Gradient/Timed/elastic_circle_1";
import { elastic_drip_1 } from "./Gradient/Timed/elastic_drip_1";
import { elastic_inter_semicircle_1 } from "./Gradient/Timed/elastic_inter_semicircle_1";
import { elastic_semicircle_1 } from "./Gradient/Timed/elastic_semicircle_1";
import { fill_2c } from "./Gradient/Timed/fill_2c";
import { fill_3c } from "./Gradient/Timed/fill_3c";
import { fill_diag_2v2c } from "./Gradient/Timed/fill_diag_2v2c";
import { flow_2 } from "./Gradient/Timed/flow_2";
import { flow_3 } from "./Gradient/Timed/flow_3";
import { flow_diag_2 } from "./Gradient/Timed/flow_diag_2";
import { flow_diag_3 } from "./Gradient/Timed/flow_diag_3";
import { merge_1v1 } from "./Gradient/Timed/merge_1v1";
import { merge_diag_1v1 } from "./Gradient/Timed/merge_diag_1v1";
import { merge_diag_async_4 } from "./Gradient/Timed/merge_diag_async_4";
import { orbit_1 } from "./Gradient/Timed/orbit_1";
import { orbit_1v1 } from "./Gradient/Timed/orbit_1v1";
import { orbit_async_2v1 } from "./Gradient/Timed/orbit_async_2v1";
import { orbit_async_3 } from "./Gradient/Timed/orbit_async_3";
import { scan_1 } from "./Gradient/Timed/scan_1";
import { scan_1v1 } from "./Gradient/Timed/scan_1v1";
import { scan_diag_1 } from "./Gradient/Timed/scan_diag_1";
import { scan_diag_1v1 } from "./Gradient/Timed/scan_diag_1v1";
import { snake_1 } from "./Gradient/Timed/snake_1";
import { snake_1v1 } from "./Gradient/Timed/snake_1v1";
import { snake_2 } from "./Gradient/Timed/snake_2";
import { snake_4 } from "./Gradient/Timed/snake_4";
import { snake_async_3 } from "./Gradient/Timed/snake_async_3";
import { snake_inter_2 } from "./Gradient/Timed/snake_inter_2";
import { sweep_1 } from "./Gradient/Timed/sweep_1";
import { sweep_1v1 } from "./Gradient/Timed/sweep_1v1";
import { sweep_diag_1 } from "./Gradient/Timed/sweep_diag_1";
import { sweep_diag_1v1 } from "./Gradient/Timed/sweep_diag_1v1";
import { sweep_diag_async_4 } from "./Gradient/Timed/sweep_diag_async_4";
import { band_1 } from "./Gradient/Tracked/band_1";
import { band_1v1 } from "./Gradient/Tracked/band_1v1";
import { band_diag_1 } from "./Gradient/Tracked/band_diag_1";
import { hand_1 } from "./Gradient/Tracked/hand_1";
import { hand_trail_1 } from "./Gradient/Tracked/hand_trail_1";
import { hand_trail_2 } from "./Gradient/Tracked/hand_trail_2";
import { hand_trail_3 } from "./Gradient/Tracked/hand_trail_3";
import { spot_1 } from "./Gradient/Tracked/spot_1";
import { spot_flare_2 } from "./Gradient/Tracked/spot_flare_2";
import { spot_flare_3 } from "./Gradient/Tracked/spot_flare_3";
import { spot_ripple_1 } from "./Gradient/Tracked/spot_ripple_1";
import { spot_ripple_2 } from "./Gradient/Tracked/spot_ripple_2";
import { spot_ripple_3 } from "./Gradient/Tracked/spot_ripple_3";
import { spot_smear_2 } from "./Gradient/Tracked/spot_smear_2";
import { spot_smear_3 } from "./Gradient/Tracked/spot_smear_3";
import { spot_trail_1 } from "./Gradient/Tracked/spot_trail_1";
import { spot_trail_2 } from "./Gradient/Tracked/spot_trail_2";
import { spot_trail_3 } from "./Gradient/Tracked/spot_trail_3";
import { constant } from "./Iteration/constant";
import { repeat1_1 } from "./Iteration/repeat1_1";
import { repeat2_1 } from "./Iteration/repeat2_1";
import { repeat3_3 } from "./Iteration/repeat3_3";
import { circle_g_2 } from "./Pattern/circle_g_2";
import { circle_hd_2 } from "./Pattern/circle_hd_2";
import { circle_hs_2 } from "./Pattern/circle_hs_2";
import { hexagon_ft_2 } from "./Pattern/hexagon_ft_2";
import { hexagon_pt_2 } from "./Pattern/hexagon_pt_2";
import { lozenge_d_2 } from "./Pattern/lozenge_d_2";
import { triangle_s_2 } from "./Pattern/triangle_s_2";
import { triangle_t_2 } from "./Pattern/triangle_t_2";
import { whirlCurved_2 } from "./Pattern/whirlCurved_2";
import { whirl_2 } from "./Pattern/whirl_2";
import type {
    IterationConfig,
    PatternConfig,
    SVGDefsColors,
    TimedGradientConfig,
    TimedGradientEntry,
    TrackedGradientConfig,
    TrackedGradientEntry,
} from "./SVGDefs.types";

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
    }

    export namespace Pattern {
        export const SAMPLE_CONFIGS = {
            circle_g_2,
            circle_hd_2,
            circle_hs_2,
            hexagon_ft_2,
            hexagon_pt_2,
            lozenge_d_2,
            triangle_s_2,
            triangle_t_2,
            whirlCurved_2,
            whirl_2,
        } as const satisfies Record<string, PatternConfig>;

        export type SampleKey = keyof typeof SAMPLE_CONFIGS;
    }

    export namespace Gradient {
        export namespace Timed {
            export const SAMPLE_FACTORIES = {
                elastic_circle_1,
                elastic_drip_1,
                elastic_inter_semicircle_1,
                elastic_semicircle_1,
                fill_2c,
                fill_3c,
                fill_diag_2v2c,
                flow_2,
                flow_3,
                flow_diag_2,
                flow_diag_3,
                merge_1v1,
                merge_diag_1v1,
                merge_diag_async_4,
                orbit_1,
                orbit_1v1,
                orbit_async_2v1,
                orbit_async_3,
                scan_1,
                scan_1v1,
                scan_diag_1,
                scan_diag_1v1,
                snake_1,
                snake_1v1,
                snake_2,
                snake_4,
                snake_async_3,
                snake_inter_2,
                sweep_1,
                sweep_1v1,
                sweep_diag_1,
                sweep_diag_1v1,
                sweep_diag_async_4,
            } as const;

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

            export const toConfig = (entry: TimedGradientEntry): TimedGradientConfig =>
                (SAMPLE_FACTORIES[entry.family] as (opts?: unknown) => TimedGradientConfig)(
                    "defs" in entry ? entry.defs : undefined,
                );
        }

        export namespace Tracked {
            export const SAMPLE_FACTORIES = {
                band_1,
                band_1v1,
                band_diag_1,
                hand_1,
                hand_trail_1,
                hand_trail_2,
                hand_trail_3,
                spot_1,
                spot_flare_2,
                spot_flare_3,
                spot_ripple_1,
                spot_ripple_2,
                spot_ripple_3,
                spot_smear_2,
                spot_smear_3,
                spot_trail_1,
                spot_trail_2,
                spot_trail_3,
            } as const;

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
                spot_smear_2: { family: "spot_smear_2" },
                spot_smear_3: { family: "spot_smear_3" },
                spot_trail_1: { family: "spot_trail_1" },
                spot_trail_2: { family: "spot_trail_2" },
                spot_trail_3: { family: "spot_trail_3" },
            } as const satisfies Record<string, TrackedGradientEntry>;

            export type Entry = TrackedGradientEntry;

            export type SampleKey = keyof typeof SAMPLE_ENTRIES;

            export const SAMPLE_KEYS = Object.keys(SAMPLE_ENTRIES) as SampleKey[];

            export const toConfig = (entry: TrackedGradientEntry): TrackedGradientConfig =>
                (SAMPLE_FACTORIES[entry.family] as (opts?: unknown) => TrackedGradientConfig)(
                    "defs" in entry ? entry.defs : undefined,
                );
        }
    }
}

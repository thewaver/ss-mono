import { elastic_circle_3 } from "./Gradient/Timed/elastic_circle_3";
import { elastic_drip_3 } from "./Gradient/Timed/elastic_drip_3";
import { elastic_inter_semicircle_3 } from "./Gradient/Timed/elastic_inter_semicircle_3";
import { elastic_semicircle_3 } from "./Gradient/Timed/elastic_semicircle_3";
import { flow_2s } from "./Gradient/Timed/flow_2s";
import { flow_3 } from "./Gradient/Timed/flow_3";
import { flow_3s } from "./Gradient/Timed/flow_3s";
import { flow_diag_2s } from "./Gradient/Timed/flow_diag_2s";
import { flow_diag_3 } from "./Gradient/Timed/flow_diag_3";
import { flow_diag_3s } from "./Gradient/Timed/flow_diag_3s";
import { hue_1 } from "./Gradient/Timed/hue_1";
import { hue_diag_inter_2 } from "./Gradient/Timed/hue_diag_inter_2";
import { hue_pulse_2 } from "./Gradient/Timed/hue_pulse_2";
import { hue_rot_3 } from "./Gradient/Timed/hue_rot_3";
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
import { hand_trail_2c } from "./Gradient/Tracked/hand_trail_2c";
import { hand_trail_3 } from "./Gradient/Tracked/hand_trail_3";
import { hand_trail_3c } from "./Gradient/Tracked/hand_trail_3c";
import { spot_1 } from "./Gradient/Tracked/spot_1";
import { spot_flare_2 } from "./Gradient/Tracked/spot_flare_2";
import { spot_flare_3 } from "./Gradient/Tracked/spot_flare_3";
import { spot_ripple_1 } from "./Gradient/Tracked/spot_ripple_1";
import { spot_ripple_1s } from "./Gradient/Tracked/spot_ripple_1s";
import { spot_ripple_2 } from "./Gradient/Tracked/spot_ripple_2";
import { spot_ripple_2c } from "./Gradient/Tracked/spot_ripple_2c";
import { spot_ripple_2cs } from "./Gradient/Tracked/spot_ripple_2cs";
import { spot_ripple_2s } from "./Gradient/Tracked/spot_ripple_2s";
import { spot_ripple_3 } from "./Gradient/Tracked/spot_ripple_3";
import { spot_ripple_3c } from "./Gradient/Tracked/spot_ripple_3c";
import { spot_ripple_3cs } from "./Gradient/Tracked/spot_ripple_3cs";
import { spot_ripple_3s } from "./Gradient/Tracked/spot_ripple_3s";
import { spot_smear_2 } from "./Gradient/Tracked/spot_smear_2";
import { spot_smear_2c } from "./Gradient/Tracked/spot_smear_2c";
import { spot_smear_3 } from "./Gradient/Tracked/spot_smear_3";
import { spot_smear_3c } from "./Gradient/Tracked/spot_smear_3c";
import { spot_trail_1 } from "./Gradient/Tracked/spot_trail_1";
import { spot_trail_2 } from "./Gradient/Tracked/spot_trail_2";
import { spot_trail_2c } from "./Gradient/Tracked/spot_trail_2c";
import { spot_trail_3 } from "./Gradient/Tracked/spot_trail_3";
import { spot_trail_3c } from "./Gradient/Tracked/spot_trail_3c";
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
    TrackedGradientConfig,
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
            export const SAMPLE_CONFIGS = {
                elastic_circle_3,
                elastic_drip_3,
                elastic_inter_semicircle_3,
                elastic_semicircle_3,
                flow_2s,
                flow_3,
                flow_3s,
                flow_diag_2s,
                flow_diag_3,
                flow_diag_3s,
                hue_1,
                hue_diag_inter_2,
                hue_pulse_2,
                hue_rot_3,
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
            } as const satisfies Record<string, TimedGradientConfig>;

            export type SampleKey = keyof typeof SAMPLE_CONFIGS;
        }

        export namespace Tracked {
            export const SAMPLE_CONFIGS = {
                band_1,
                band_1v1,
                band_diag_1,
                hand_1,
                hand_trail_1,
                hand_trail_2,
                hand_trail_2c,
                hand_trail_3,
                hand_trail_3c,
                spot_1,
                spot_flare_2,
                spot_flare_3,
                spot_ripple_1,
                spot_ripple_1s,
                spot_ripple_2,
                spot_ripple_2c,
                spot_ripple_2cs,
                spot_ripple_2s,
                spot_ripple_3,
                spot_ripple_3c,
                spot_ripple_3cs,
                spot_ripple_3s,
                spot_smear_2,
                spot_smear_2c,
                spot_smear_3,
                spot_smear_3c,
                spot_trail_1,
                spot_trail_2,
                spot_trail_2c,
                spot_trail_3,
                spot_trail_3c,
            } as const satisfies Record<string, TrackedGradientConfig>;

            export type SampleKey = keyof typeof SAMPLE_CONFIGS;
        }
    }
}

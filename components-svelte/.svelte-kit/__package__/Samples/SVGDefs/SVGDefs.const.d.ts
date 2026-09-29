import { type IterationConfig, type SVGDefsColors, type TimedGradientEntry, type TrackedGradientEntry } from "@thewaver/ss-components";
import type { PatternConfig, TimedGradientConfig, TrackedGradientConfig } from "./SVGDefsSvelte.types.js";
export declare namespace SVGDefsSamples {
    const SAMPLE_COLORS: SVGDefsColors;
    const SAMPLE_COLORS_MONO: SVGDefsColors;
    namespace Iteration {
        const SAMPLE_CONFIGS: {
            readonly constant: IterationConfig;
            readonly repeat1_1: IterationConfig;
            readonly repeat2_1: IterationConfig;
            readonly repeat3_3: IterationConfig;
        };
        type SampleKey = keyof typeof SAMPLE_CONFIGS;
        const SAMPLE_KEYS: SampleKey[];
    }
    namespace Pattern {
        const SAMPLE_CONFIGS: {
            readonly circle_g_2: PatternConfig;
            readonly circle_hd_2: PatternConfig;
            readonly circle_hs_2: PatternConfig;
            readonly hexagon_ft_2: PatternConfig;
            readonly hexagon_pt_2: PatternConfig;
            readonly lozenge_d_2: PatternConfig;
            readonly triangle_s_2: PatternConfig;
            readonly triangle_t_2: PatternConfig;
            readonly whirl_2: PatternConfig;
            readonly whirl_curved_2: PatternConfig;
        };
        type SampleKey = keyof typeof SAMPLE_CONFIGS;
        const SAMPLE_KEYS: SampleKey[];
    }
    namespace Gradient {
        namespace Timed {
            const SAMPLE_FACTORIES: {
                readonly elastic_circle_1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly elastic_drip_1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly elastic_inter_semicircle_1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly elastic_semicircle_1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly fill_2c: () => TimedGradientConfig;
                readonly fill_3c: () => TimedGradientConfig;
                readonly fill_diag_2v2c: () => TimedGradientConfig;
                readonly flow_2: (opts?: import("@thewaver/ss-components").GradientBandedCycleOpts) => TimedGradientConfig;
                readonly flow_3: (opts?: import("@thewaver/ss-components").GradientBandedCycleOpts) => TimedGradientConfig;
                readonly flow_diag_2: (opts?: import("@thewaver/ss-components").GradientBandedCycleOpts) => TimedGradientConfig;
                readonly flow_diag_3: (opts?: import("@thewaver/ss-components").GradientBandedCycleOpts) => TimedGradientConfig;
                readonly merge_1v1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly merge_diag_1v1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly merge_diag_async_4: () => TimedGradientConfig;
                readonly orbit_1: (opts?: import("@thewaver/ss-components").GradientCycleStepsOpts) => TimedGradientConfig;
                readonly orbit_1v1: (opts?: import("@thewaver/ss-components").GradientCycleStepsOpts) => TimedGradientConfig;
                readonly orbit_async_2v1: (opts?: import("@thewaver/ss-components").GradientStepsOpts) => TimedGradientConfig;
                readonly orbit_async_3: (opts?: import("@thewaver/ss-components").GradientStepsOpts) => TimedGradientConfig;
                readonly scan_1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly scan_1v1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly scan_diag_1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly scan_diag_1v1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly snake_1: (opts?: import("@thewaver/ss-components").GradientCycleStepsOpts) => TimedGradientConfig;
                readonly snake_1v1: (opts?: import("@thewaver/ss-components").GradientCycleStepsOpts) => TimedGradientConfig;
                readonly snake_2: (opts?: import("@thewaver/ss-components").GradientCycleStepsOpts) => TimedGradientConfig;
                readonly snake_4: (opts?: import("@thewaver/ss-components").GradientCycleStepsOpts) => TimedGradientConfig;
                readonly snake_async_3: (opts?: import("@thewaver/ss-components").GradientStepsOpts) => TimedGradientConfig;
                readonly snake_inter_2: (opts?: import("@thewaver/ss-components").GradientCycleStepsOpts) => TimedGradientConfig;
                readonly sweep_1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly sweep_1v1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly sweep_diag_1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly sweep_diag_1v1: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
                readonly sweep_diag_async_4: (opts?: import("@thewaver/ss-components").GradientCycleOpts) => TimedGradientConfig;
            };
            const SAMPLE_ENTRIES: {
                readonly elastic_circle_1: {
                    readonly family: "elastic_circle_1";
                };
                readonly elastic_drip_1: {
                    readonly family: "elastic_drip_1";
                };
                readonly elastic_inter_semicircle_1: {
                    readonly family: "elastic_inter_semicircle_1";
                };
                readonly elastic_semicircle_1: {
                    readonly family: "elastic_semicircle_1";
                };
                readonly fill_2c: {
                    readonly family: "fill_2c";
                };
                readonly fill_3c: {
                    readonly family: "fill_3c";
                };
                readonly fill_diag_2v2c: {
                    readonly family: "fill_diag_2v2c";
                };
                readonly flow_2: {
                    readonly family: "flow_2";
                };
                readonly flow_3: {
                    readonly family: "flow_3";
                };
                readonly flow_diag_2: {
                    readonly family: "flow_diag_2";
                };
                readonly flow_diag_3: {
                    readonly family: "flow_diag_3";
                };
                readonly merge_1v1: {
                    readonly family: "merge_1v1";
                };
                readonly merge_diag_1v1: {
                    readonly family: "merge_diag_1v1";
                };
                readonly merge_diag_async_4: {
                    readonly family: "merge_diag_async_4";
                };
                readonly orbit_1: {
                    readonly family: "orbit_1";
                };
                readonly orbit_1v1: {
                    readonly family: "orbit_1v1";
                };
                readonly orbit_async_2v1: {
                    readonly family: "orbit_async_2v1";
                };
                readonly orbit_async_3: {
                    readonly family: "orbit_async_3";
                };
                readonly scan_1: {
                    readonly family: "scan_1";
                };
                readonly scan_1v1: {
                    readonly family: "scan_1v1";
                };
                readonly scan_diag_1: {
                    readonly family: "scan_diag_1";
                };
                readonly scan_diag_1v1: {
                    readonly family: "scan_diag_1v1";
                };
                readonly snake_1: {
                    readonly family: "snake_1";
                };
                readonly snake_1v1: {
                    readonly family: "snake_1v1";
                };
                readonly snake_2: {
                    readonly family: "snake_2";
                };
                readonly snake_4: {
                    readonly family: "snake_4";
                };
                readonly snake_async_3: {
                    readonly family: "snake_async_3";
                };
                readonly snake_inter_2: {
                    readonly family: "snake_inter_2";
                };
                readonly sweep_1: {
                    readonly family: "sweep_1";
                };
                readonly sweep_1v1: {
                    readonly family: "sweep_1v1";
                };
                readonly sweep_diag_1: {
                    readonly family: "sweep_diag_1";
                };
                readonly sweep_diag_1v1: {
                    readonly family: "sweep_diag_1v1";
                };
                readonly sweep_diag_async_4: {
                    readonly family: "sweep_diag_async_4";
                };
            };
            type Entry = TimedGradientEntry;
            type SampleKey = keyof typeof SAMPLE_ENTRIES;
            const SAMPLE_KEYS: SampleKey[];
            const toConfig: (entry: TimedGradientEntry) => TimedGradientConfig;
        }
        namespace Tracked {
            const SAMPLE_FACTORIES: {
                readonly band_1: (opts?: import("@thewaver/ss-components").GradientBandOpts) => TrackedGradientConfig;
                readonly band_1v1: (opts?: import("@thewaver/ss-components").GradientBandOpts) => TrackedGradientConfig;
                readonly band_diag_1: (opts?: import("@thewaver/ss-components").GradientBandOpts) => TrackedGradientConfig;
                readonly hand_1: (opts?: import("@thewaver/ss-components").GradientHandOpts) => TrackedGradientConfig;
                readonly hand_trail_1: (opts?: import("@thewaver/ss-components").GradientHandTrailOpts) => TrackedGradientConfig;
                readonly hand_trail_2: (opts?: import("@thewaver/ss-components").GradientHandTrailOpts) => TrackedGradientConfig;
                readonly hand_trail_3: (opts?: import("@thewaver/ss-components").GradientHandTrailOpts) => TrackedGradientConfig;
                readonly spot_1: (opts?: import("@thewaver/ss-components").GradientSpotOpts) => TrackedGradientConfig;
                readonly spot_flare_2: (opts?: import("@thewaver/ss-components").GradientFlareOpts) => TrackedGradientConfig;
                readonly spot_flare_3: (opts?: import("@thewaver/ss-components").GradientFlareOpts) => TrackedGradientConfig;
                readonly spot_ripple_1: (opts?: import("@thewaver/ss-components").GradientRippleSampleOpts) => TrackedGradientConfig;
                readonly spot_ripple_2: (opts?: import("@thewaver/ss-components").GradientRippleSampleOpts) => TrackedGradientConfig;
                readonly spot_ripple_3: (opts?: import("@thewaver/ss-components").GradientRippleSampleOpts) => TrackedGradientConfig;
                readonly spot_smear_1: (opts?: import("@thewaver/ss-components").GradientSmearSampleOpts) => TrackedGradientConfig;
                readonly spot_smear_2: (opts?: import("@thewaver/ss-components").GradientSmearSampleOpts) => TrackedGradientConfig;
                readonly spot_smear_3: (opts?: import("@thewaver/ss-components").GradientSmearSampleOpts) => TrackedGradientConfig;
                readonly spot_trail_1: (opts?: import("@thewaver/ss-components").GradientSpotTrailOpts) => TrackedGradientConfig;
                readonly spot_trail_2: (opts?: import("@thewaver/ss-components").GradientSpotTrailOpts) => TrackedGradientConfig;
                readonly spot_trail_3: (opts?: import("@thewaver/ss-components").GradientSpotTrailOpts) => TrackedGradientConfig;
            };
            const SAMPLE_ENTRIES: {
                readonly band_1: {
                    readonly family: "band_1";
                };
                readonly band_1v1: {
                    readonly family: "band_1v1";
                };
                readonly band_diag_1: {
                    readonly family: "band_diag_1";
                };
                readonly hand_1: {
                    readonly family: "hand_1";
                };
                readonly hand_trail_1: {
                    readonly family: "hand_trail_1";
                };
                readonly hand_trail_2: {
                    readonly family: "hand_trail_2";
                };
                readonly hand_trail_3: {
                    readonly family: "hand_trail_3";
                };
                readonly spot_1: {
                    readonly family: "spot_1";
                };
                readonly spot_flare_2: {
                    readonly family: "spot_flare_2";
                };
                readonly spot_flare_3: {
                    readonly family: "spot_flare_3";
                };
                readonly spot_ripple_1: {
                    readonly family: "spot_ripple_1";
                };
                readonly spot_ripple_2: {
                    readonly family: "spot_ripple_2";
                };
                readonly spot_ripple_3: {
                    readonly family: "spot_ripple_3";
                };
                readonly spot_smear_1: {
                    readonly family: "spot_smear_1";
                };
                readonly spot_smear_2: {
                    readonly family: "spot_smear_2";
                };
                readonly spot_smear_3: {
                    readonly family: "spot_smear_3";
                };
                readonly spot_trail_1: {
                    readonly family: "spot_trail_1";
                };
                readonly spot_trail_2: {
                    readonly family: "spot_trail_2";
                };
                readonly spot_trail_3: {
                    readonly family: "spot_trail_3";
                };
            };
            type Entry = TrackedGradientEntry;
            type SampleKey = keyof typeof SAMPLE_ENTRIES;
            const SAMPLE_KEYS: SampleKey[];
            const toConfig: (entry: TrackedGradientEntry) => TrackedGradientConfig;
        }
    }
}

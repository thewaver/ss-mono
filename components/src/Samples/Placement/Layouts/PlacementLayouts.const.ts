import type { PlacementLayoutFn } from "../../../Abstracts/Placement/Placement.types";
import { PlacementLayoutUtils } from "./PlacementLayouts.utils";

export namespace PlacementLayouts {
    export const SAMPLE_LAYOUTS = {
        ring: PlacementLayoutUtils.ring,
        arc: PlacementLayoutUtils.arc,
        fan: PlacementLayoutUtils.fan,
        honeycomb: PlacementLayoutUtils.honeycomb,
        podiumLozenge: PlacementLayoutUtils.podiumLozenge,
        whorlCircle: PlacementLayoutUtils.whorlCircle,
        whorlHex: PlacementLayoutUtils.whorlHex,
        whorlSquare: PlacementLayoutUtils.whorlSquare,
        zigzag: PlacementLayoutUtils.zigzag,
    } satisfies Record<string, PlacementLayoutFn>;

    export type SampleKey = keyof typeof SAMPLE_LAYOUTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_LAYOUTS) as SampleKey[];
}

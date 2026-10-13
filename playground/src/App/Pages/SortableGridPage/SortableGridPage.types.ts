import type { SortableGridFootprint, SortableGridSpot } from "@thewaver/ss-components";

export type Gear = {
    id: string;
    name: string;
    glyph: string;
};

export type GearPlacement = {
    value: Gear;
    spot: SortableGridSpot;
    footprint: SortableGridFootprint;
};

export type GearEntry = {
    value: Gear;
};

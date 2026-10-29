import type { CellStop, SVGColorMixing } from "@thewaver/ss-components";
import type { Rect, Size2d } from "@thewaver/ss-utils";

export type CellGpuTrackKey = Exclude<keyof CellStop, "at">;

export type CellGpuMode = "slices" | "particles" | "direct";

export type CellGpuPresenter = "transfer" | "copy";

export type CellGpuCell = {
    left: number;
    top: number;
    width: number;
    height: number;
    weight: number;
    table: number;
    tint?: [number, number, number, number];
    direct?: [number, number, number, number];
};

export type CellGpuFrame = {
    mode: CellGpuMode;
    src: string;
    tables: CellStop[][];
    easing: Float32Array;
    cells: CellGpuCell[];
    size: Size2d;
    area: Rect;
    scale: number;
    timeline: number;
    half: number;
    isDescending: boolean;
    isShown: boolean;
    hasPerspective: boolean;
    clockMs?: number;
    lifetimeMs?: number;
    channelMixing?: SVGColorMixing;
};

export type CellGpuItem = {
    draw: (frame: CellGpuFrame) => Size2d;
    dispose: () => void;
};

import type { Accessor, JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { BarrelAxis, BarrelFace } from "../../Abstracts/Barrel/Barrel.types";
import type { RotatorPhase, RotatorSpinDefs } from "../../Abstracts/Rotator/Rotator.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type WheelVariant = "overhead" | "drum";

export type WheelAxis = BarrelAxis;

export type WheelFace = BarrelFace;

export type WheelWedgeState = {
    index: number;
    wedgeCount: number;
    face: WheelFace;
    isSelected: boolean;
};

export type WheelController = {
    getIndex: Accessor<number>;
    getPhase: Accessor<RotatorPhase>;
    getIsSpinnable: Accessor<boolean>;
    getIsAutoSpinning: Accessor<boolean>;
    getIsUserSpinning: Accessor<boolean>;
    spin: () => void;
};

export type WheelState = {
    ariaLabel: string;
    isDisabled?: boolean;
    spinDurationMs?: number;
    settleDurationMs?: number;
    restDurationMs?: number;
};

export type WheelLabels = {
    computeWedgeLabel?: (index: number, wedgeCount: number) => string;
};

export type WheelSlots<T> = {
    wedges: MaybeAccessor<T[]>;
    idleDelayMs?: MaybeAccessor<number | undefined>;
    indexSignal?: SignalSource<number>;
    autoSpinSignal?: SignalSource<boolean>;
    computeSpinTarget: () => number | Promise<number>;
    computeSpinDefs?: (index: number, wedgeCount: number) => RotatorSpinDefs;
    renderWedge: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    onSelectedWedgeChange?: (index: number) => void;
    onSpinEnd?: (index: number) => void;
    onMount?: (controller: WheelController) => void;
};

export type WheelProps<T> = AccessorProps<
    WheelState &
        WheelLabels & {
            variant: WheelVariant;
            axis?: WheelAxis;
            wedgeSize?: Size2d;
        }
> &
    WheelSlots<T> & {
        renderWedgeBack?: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    };

export type OverheadWheelProps<T> = AccessorProps<WheelState & WheelLabels> & WheelSlots<T>;

export type DrumWheelProps<T> = AccessorProps<
    WheelState &
        WheelLabels & {
            axis?: WheelAxis;
            wedgeSize: Size2d;
        }
> &
    WheelSlots<T> & {
        renderWedgeBack: (getWedge: Accessor<T>, getState: Accessor<WheelWedgeState>) => JSX.Element;
    };

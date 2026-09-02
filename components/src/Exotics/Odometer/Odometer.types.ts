import type { Accessor, JSX } from "solid-js";

import type { Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../Utils/typeUtils";

export type OdometerSlotKind = "digit" | "fixed";

export type OdometerSlot = {
    kind: OdometerSlotKind;
    character: string;
    digitIndex: number;
};

export type OdometerDirection = "up" | "down" | "same";

export type OdometerProps = AccessorProps<{
    text: string;
    digitSize: Size2d;
    turnDurationMs?: number;
    cascadeDelayMs?: number;
    ariaLabel?: string;
    renderDigit?: (getDigit: Accessor<string>) => JSX.Element;
    renderFixed?: (getCharacter: Accessor<string>) => JSX.Element;
}>;

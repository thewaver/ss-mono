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
    /** The text the digits should settle on. Changing it is what starts them turning. */
    text: string;
    /** How large one digit is. */
    digitSize: Size2d;
    /** How long one digit takes to turn from its old face to its new one. */
    turnDurationMs?: number;
    /** How long each digit waits after the one beside it starts, which is what makes the turn ripple along. */
    cascadeDelayMs?: number;
    /** Names the odometer for assistive technology, so a reader hears the value rather than the separate digits. */
    ariaLabel?: string;
    /** Draws one turning digit. */
    renderDigit?: (getDigit: Accessor<string>) => JSX.Element;
    /** Draws one character that does not turn, such as a separator. */
    renderFixed?: (getCharacter: Accessor<string>) => JSX.Element;
}>;

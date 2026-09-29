import type { Color } from "@thewaver/ss-utils";

export type ColorAreaAxis = "saturation" | "brightness";

export type ColorAreaRenderProps = {
    /** The color the square is currently on, as hue, saturation, value and alpha. */
    hsv: Color.HSVA;
    /** Whether the handle is being dragged right now. */
    isDragging: boolean;
    /** Which axis should show a focus ring, or nothing when the square was reached by pointer. */
    focusVisibleAxis?: ColorAreaAxis;
};

export type ColorAreaCbs = {
    /** Runs as the color changes. */
    onInput?: (hsv: Color.HSVA) => void;
    /** Runs when the pointer arrives over the square. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the square. */
    onMouseLeave?: (e: MouseEvent) => void;
};

export type ColorAreaState = {
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the square for assistive technology. */
    ariaLabel?: string;
    /** Names each axis separately, since the square carries two values a reader has to tell apart. */
    axisLabels: Record<ColorAreaAxis, string>;
    /** How far one press of an arrow key moves the handle, in the same `0`–`100` percent the axes carry. */
    step?: number;
};

import type { Color, Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { ColorAreaAxis } from "../ColorArea/ColorArea.types";

export type ColorInputRenderProps = {
    /**
     * The color as written, in whatever notation the consumer handed in. A value the field could not read is
     * passed through untouched, so a painter can show the text that was refused.
     */
    value: string;
    /**
     * The same color split into hue, saturation, value and alpha, which is what the picker actually moves in.
     * Saturation and value are `0`–`100` percentages. Where the value could not be read this is the last color
     * the picker held, and {@link ColorInputRenderProps.isUnreadable} says so.
     */
    hsv: Color.HSVA;
    /** Whether the picker is open. */
    isOpen: boolean;
    /**
     * Whether the value is a color the field cannot read.
     *
     * A field given something it cannot show states that rather than substituting a color of its own, so the
     * consumer's value is never overwritten — and the error flag is raised for the same reason. Nothing is
     * written back out while this is true, so the original text survives until it is replaced with a color.
     */
    isUnreadable: boolean;
};

export type ColorInputCbs = {
    /** Runs as the color changes. */
    onInput?: (value: string) => void;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void;
};

export type ColorInputState = {
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the color input for assistive technology. */
    ariaLabel?: string;
    /**
     * Names the popup the field opens. It is a dialog, so it needs a name of its own; the field's name cannot
     * serve, because a field named through a `Label` has no `ariaLabel` to borrow.
     */
    pickerLabel: string;
    /** Names the saturation and brightness square, which has no visible label of its own. */
    areaLabel: string;
    /** Names each axis of the saturation and brightness square, which is handed on to its `axisLabels`. */
    areaAxisLabels: Record<ColorAreaAxis, string>;
    /** Names the hue slider, which has no visible label of its own. */
    hueLabel: string;
    /** Where the picker sits against the field. */
    placement?: AnchorPlacement;
    /** How far the picker is held clear of the field. */
    offset?: Point2d;
    /** How long the picker takes to fade in and out. */
    transitionDurationMs?: number;
};

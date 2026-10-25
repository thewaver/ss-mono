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

export type BaseColorInputCbs = {
    /** Runs as the color changes, with the value written in the notation the field was handed. */
    onInput?: (value: string) => void;
    /**
     * Words for the current color, which a screen reader reads after the field's name, since the field's name says
     * what the color is for and the painted swatch says nothing to someone who cannot see it. It is handed the value
     * as written and the same color as hue, saturation, value and alpha, and answers in the page's language — a
     * color's name, or its channels spelled out.
     *
     * Left out, the value itself is read as written, such as `#3366ff`. An empty value, or an empty answer, adds
     * nothing. A description from an enclosing form field is read as well.
     */
    computeValueText?: (value: string, hsv: Color.HSVA) => string;
};

export type ColorInputCbs = BaseColorInputCbs & {
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void;
};

export type BaseColorInputValues = {
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
    /**
     * Where the picker sits against the field. Left out, it hangs below the field lined up with the edge the text
     * starts from: the left, or the right where the field sits in right-to-left text. Given, it is used as it
     * stands in either direction.
     */
    placement?: AnchorPlacement;
    /** How far the picker is held clear of the field. */
    offset?: Point2d;
    /** How long the picker takes to fade in and out. */
    transitionDurationMs?: number;
};

export type BaseColorInputProps = BaseColorInputValues & BaseColorInputCbs;

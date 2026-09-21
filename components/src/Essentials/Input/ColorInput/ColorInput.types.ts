import type { JSX, Signal } from "solid-js";

import type { Color, Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type { ColorAreaRenderProps } from "../ColorArea/ColorArea.types";
import type { RangeRenderProps } from "../Range/Range.types";

export type ColorInputRenderProps = {
    /** The color as written, in whatever notation the consumer handed in. */
    value: string;
    /** The same color split into hue, saturation, value and alpha, which is what the picker actually moves in. */
    hsv: Color.HSVA;
    /** Whether the picker is open. */
    isOpen: boolean;
};

export type ColorInputCbs = {
    /** Runs as the color changes. */
    onInput?: (value: string) => void | Promise<void>;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type ColorInputState = {
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the color input for assistive technology. */
    ariaLabel?: string;
    /**
     * Names the popup the field opens. It is a dialog, so it needs a name of its own; the field's name cannot
     * serve, because a field named through a `Label` has no `ariaLabel` to borrow. Defaults to "Choose a color".
     */
    pickerLabel?: string;
    /** Names the saturation and brightness square, which has no visible label of its own. */
    areaLabel?: string;
    /** Names the hue slider, which has no visible label of its own. */
    hueLabel?: string;
    /** Where the picker sits against the field. */
    placement?: AnchorPlacement;
    /** How far the picker is held clear of the field. */
    offset?: Point2d;
    /** How long the picker takes to fade in and out. */
    transitionDurationMs?: number;
};

export type ColorInputFieldProps = AccessorProps<
    ColorInputCbs &
        InteractionControlProps<ColorInputRenderProps> &
        Pick<ColorInputState, "ariaLabel"> & {
            /** Identifies the picker, so the field can point at it. */
            popupId: string;
            /** Whether the picker is open. */
            isOpen: boolean;
            /** Runs when the field is activated and the picker should open or close. */
            onToggle: () => void;
        }
>;

export type ColorInputProps = Omit<InteractionWrapperProps<ColorInputRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        ColorInputCbs &
            Pick<InteractionControlProps<ColorInputRenderProps>, "id" | "renderContent"> &
            ColorInputState & {
                /** The color. It is the only thing that changes it. */
                valueSignal: SignalSource<string>;
                /** Whether the picker is open. It is the only thing that opens or closes it. */
                visibilitySignal?: SignalSource<boolean>;
                /** Draws the saturation and brightness square. */
                renderArea: (getRenderProps: () => InteractionFlags<ColorAreaRenderProps>) => JSX.Element;
                /** Draws the hue slider. */
                renderHue: (getRenderProps: () => InteractionFlags<RangeRenderProps>) => JSX.Element;
                /**
                 * Draws the surface the picker sits on. The picker is handed in rather than built, so the consumer
                 * decides what surrounds it.
                 */
                renderPopup: (
                    renderSurface: () => JSX.Element,
                    hsvSignal: Signal<Color.HSVA>,
                    getVisibilityTarget: () => 0 | 1,
                    getTransitionDurationMs: () => number,
                ) => JSX.Element;
            }
    >;

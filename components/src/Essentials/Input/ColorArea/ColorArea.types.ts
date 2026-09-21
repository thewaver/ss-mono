import type { Color } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

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
    onInput?: (hsv: Color.HSVA) => void | Promise<void>;
    /** Runs when the pointer arrives over the square. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the square. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type ColorAreaState = {
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the square for assistive technology. */
    ariaLabel?: string;
    /** Names each axis separately, since the square carries two values a reader has to tell apart. */
    axisLabels?: Record<ColorAreaAxis, string>;
    /** How far one press of an arrow key moves the handle. */
    step?: number;
};

export type ColorAreaElementProps = AccessorProps<
    ColorAreaCbs &
        InteractionControlProps<ColorAreaRenderProps> &
        Required<Omit<ColorAreaState, "name" | "ariaLabel">> &
        Pick<ColorAreaState, "name" | "ariaLabel"> & {
            /** The color the square is currently on. */
            hsv: Color.HSVA;
            /** Whether the square can be reached by tabbing. */
            isTabbable?: boolean;
            /** Moves the handle along one axis, as a share of the square. For the keyboard, which moves one axis at a time. */
            setAxis: (axis: ColorAreaAxis, ratio: number) => void;
            /**
             * Moves the handle along both axes at once, as shares of the square.
             *
             * A drag changes both, and writing them one at a time would report an intermediate color that the
             * pointer was never over. This writes the color once.
             */
            setAxes: (saturation: number, brightness: number) => void;
            /** Says which axis should show a focus ring, or clears it. */
            setFocusVisibleAxis: (axis?: ColorAreaAxis) => void;
            /** Says whether the handle is being dragged. */
            setIsDragging: (isDragging: boolean) => void;
        }
>;

export type ColorAreaProps = Omit<InteractionWrapperProps<ColorAreaRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        ColorAreaCbs &
            Pick<InteractionControlProps<ColorAreaRenderProps>, "id" | "renderContent"> &
            ColorAreaState & {
                /** The color. It is the only thing that changes it. */
                hsvSignal: SignalSource<Color.HSVA>;
            }
    >;

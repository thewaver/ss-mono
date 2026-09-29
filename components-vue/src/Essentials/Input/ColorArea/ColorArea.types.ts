import type { ColorAreaAxis, ColorAreaCbs, ColorAreaRenderProps, ColorAreaState } from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { ColorAreaCbs };

export type ColorAreaElementProps = ColorAreaCbs &
    InteractionControlProps<ColorAreaRenderProps> &
    Required<Omit<ColorAreaState, "name" | "ariaLabel">> &
    Pick<ColorAreaState, "name" | "ariaLabel"> & {
        /** The color the square is currently on. */
        hsv: Color.HSVA;
        /** Whether the square can be reached by tabbing. */
        isTabbable?: boolean;
        /** Moves the handle along one axis, as a percentage. For the keyboard, which moves one axis at a time. */
        setAxis: (axis: ColorAreaAxis, percent: number) => void;
        /**
         * Moves the handle to a point of the square, as shares of it across and down.
         *
         * A drag changes both axes, and writing them one at a time would report an intermediate color that the
         * pointer was never over. This writes the color once.
         */
        setDragged: (ratio: { x: number; y: number }) => void;
        /** Says which axis should show a focus ring, or clears it. */
        setFocusVisibleAxis: (axis?: ColorAreaAxis) => void;
        /** Says whether the handle is being dragged. */
        setIsDragging: (isDragging: boolean) => void;
    };

export type ColorAreaProps = Omit<InteractionWrapperProps<ColorAreaRenderProps>, "extraFlags"> &
    ColorAreaCbs &
    Pick<InteractionControlProps<ColorAreaRenderProps>, "id"> &
    ColorAreaState & {
        /** The color. It is the only thing that changes it. */
        "hsv": Color.HSVA;
        /** Receives the color as it changes, which is what `v-model:hsv` binds. */
        "onUpdate:hsv"?: (hsv: Color.HSVA) => void;
    };

export type ColorAreaSlots = Pick<InteractionWrapperSlots<ColorAreaRenderProps>, "renderDecoration"> &
    InteractionControlSlots<ColorAreaRenderProps>;

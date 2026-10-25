import type { JSX, Signal } from "solid-js";

import type {
    BaseColorInputValues,
    ColorAreaRenderProps,
    ColorInputCbs,
    ColorInputRenderProps,
    InteractionFlags,
    RangeRenderProps,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type ColorInputFieldProps = AccessorValues<Pick<BaseColorInputValues, "ariaLabel">> &
    AccessorProps<
        ColorInputCbs &
            Omit<InteractionControlProps<ColorInputRenderProps>, "ariaLabel"> & {
                /** Identifies the picker, so the field can point at it. */
                popupId: string;
                /** Whether the picker is open. */
                isOpen: boolean;
                /** Runs when the field is activated and the picker should open or close. */
                onToggle: () => void;
            }
    >;

export type ColorInputProps = Omit<InteractionWrapperProps<ColorInputRenderProps>, "renderControl" | "extraFlags"> &
    AccessorValues<BaseColorInputValues> &
    ColorInputCbs &
    AccessorProps<
        Pick<InteractionControlProps<ColorInputRenderProps>, "id" | "renderContent"> & {
            /** The color. It is the only thing that changes it. */
            value: SignalSource<string>;
            /** Whether the picker is open. It is the only thing that opens or closes it. */
            visibility?: SignalSource<boolean>;
            /**
             * Draws the saturation and brightness square. It is a picture of color rather than text, so it does not
             * mirror in right-to-left text: saturation grows to the right and brightness upward.
             */
            renderArea: (getRenderProps: () => InteractionFlags<ColorAreaRenderProps>) => JSX.Element;
            /**
             * Draws the hue slider. Like the square, it runs left to right whatever the direction of the text around
             * it, so the strip is drawn from red at the left, and the right arrow moves the thumb right.
             */
            renderHue: (getRenderProps: () => InteractionFlags<RangeRenderProps>) => JSX.Element;
            /**
             * Draws the surface the picker sits on. The picker is handed in rather than built, so the consumer
             * decides what surrounds it.
             */
            renderPopup: (
                renderSurface: () => JSX.Element,
                hsv: Signal<Color.HSVA>,
                getVisibilityTarget: () => 0 | 1,
                getTransitionDurationMs: () => number,
            ) => JSX.Element;
        }
    >;

import type { JSX, Signal } from "solid-js";

import type {
    ColorAreaRenderProps,
    ColorInputCbs,
    ColorInputRenderProps,
    ColorInputState,
    InteractionFlags,
    RangeRenderProps,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

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
                value: SignalSource<string>;
                /** Whether the picker is open. It is the only thing that opens or closes it. */
                visibility?: SignalSource<boolean>;
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
                    hsv: Signal<Color.HSVA>,
                    getVisibilityTarget: () => 0 | 1,
                    getTransitionDurationMs: () => number,
                ) => JSX.Element;
            }
    >;

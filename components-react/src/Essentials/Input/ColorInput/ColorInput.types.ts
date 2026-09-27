import type { MouseEvent, ReactNode } from "react";

import type {
    ColorAreaRenderProps,
    ColorInputRenderProps,
    ColorInputState,
    InteractionFlags,
    RangeRenderProps,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type ColorInputCbs = {
    /** Runs as the color changes, with the value written in the notation the field was handed. */
    onInput?: (value: string) => void;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export type ColorInputFieldProps = ColorInputCbs &
    InteractionControlProps<ColorInputRenderProps> &
    Pick<ColorInputState, "ariaLabel"> & {
        /** Identifies the picker, so the field can point at it. */
        popupId: string;
        /** Whether the picker is open. */
        isOpen: boolean;
        /** Runs when the field is activated and the picker should open or close. */
        onToggle: () => void;
    };

export type ColorInputProps = Omit<InteractionWrapperProps<ColorInputRenderProps>, "renderControl" | "extraFlags"> &
    ColorInputCbs &
    Pick<InteractionControlProps<ColorInputRenderProps>, "id" | "renderContent"> &
    ColorInputState & {
        /**
         * The color, and how to change it. It is the only thing that changes it, and the field writes back in the
         * notation it was handed — a hex stays a hex.
         */
        valueState: readonly [string, (value: string) => void];
        /**
         * Whether the picker is open, and how to change it. It is the only thing that opens or closes it. Leave it
         * out and the field holds its own, starting closed.
         */
        visibilityState?: readonly [boolean, (isOpen: boolean) => void];
        /** Draws the saturation and brightness square. */
        renderArea: (flags: InteractionFlags<ColorAreaRenderProps>) => ReactNode;
        /** Draws the hue slider. */
        renderHue: (flags: InteractionFlags<RangeRenderProps>) => ReactNode;
        /**
         * Draws the surface the picker sits on. The picker is handed in rather than built, so the consumer decides
         * what surrounds it, and the color is handed in as the channels the picker moves in, so anything else put
         * beside it — a preview, a field per channel — writes the same color.
         */
        renderPopup: (
            renderSurface: () => ReactNode,
            hsvState: readonly [Color.HSVA, (hsv: Color.HSVA) => void],
            visibilityTarget: 0 | 1,
            transitionDurationMs: number,
        ) => ReactNode;
    };

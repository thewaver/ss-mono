import type { Snippet } from "svelte";

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
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
import type { ValuePair } from "../../../Utils/typeUtils.js";

export type ColorInputCbs = {
    /** Runs as the color changes, with the value written in the notation the field was handed. */
    onInput?: (value: string) => void;
    /** Runs when the pointer arrives over the field. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the field. */
    onMouseLeave?: (e: MouseEvent) => void;
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
         * The color. Bind it with `bind:value`; it is the only thing that changes it, and the field writes back in the
         * notation it was handed — a hex stays a hex.
         */
        value: string;
        /**
         * Whether the picker is open. Bind it with `bind:visibility` to open or close it from outside; leave it out
         * and the field holds its own, starting closed.
         */
        visibility?: boolean;
        /** Draws the saturation and brightness square. */
        renderArea: Snippet<[flags: InteractionFlags<ColorAreaRenderProps>]>;
        /** Draws the hue slider. */
        renderHue: Snippet<[flags: InteractionFlags<RangeRenderProps>]>;
        /**
         * Draws the surface the picker sits on. The picker is handed in rather than built, so the consumer decides
         * what surrounds it, and the color is handed in as the channels the picker moves in, read and written as a
         * pair, so anything else put beside it — a preview, a field per channel — writes the same color.
         */
        renderPopup: Snippet<
            [
                renderSurface: Snippet,
                hsv: ValuePair<Color.HSVA>,
                visibilityTarget: 0 | 1,
                transitionDurationMs: number,
            ]
        >;
    };

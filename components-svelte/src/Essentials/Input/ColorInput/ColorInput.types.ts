import type { Snippet } from "svelte";

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
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
import type { ValuePair } from "../../../Utils/typeUtils.js";

export type { ColorInputCbs };

export type ColorInputFieldProps = ColorInputCbs &
    InteractionControlProps<ColorInputRenderProps> &
    Pick<BaseColorInputValues, "ariaLabel"> & {
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
    BaseColorInputValues & {
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
        /**
         * Draws the saturation and brightness square. It is a picture of color rather than text, so it does not mirror
         * in right-to-left text: saturation grows to the right and brightness upward.
         */
        renderArea: Snippet<[flags: InteractionFlags<ColorAreaRenderProps>]>;
        /**
         * Draws the hue slider. Like the square, it runs left to right whatever the direction of the text around it,
         * so the strip is drawn from red at the left, and the right arrow moves the thumb right.
         */
        renderHue: Snippet<[flags: InteractionFlags<RangeRenderProps>]>;
        /**
         * Draws the surface the picker sits on. The picker is handed in rather than built, so the consumer decides
         * what surrounds it, and the color is handed in as the channels the picker moves in, read and written as a
         * pair, so anything else put beside it — a preview, a field per channel — writes the same color.
         */
        renderPopup: Snippet<
            [renderSurface: Snippet, hsv: ValuePair<Color.HSVA>, visibilityTarget: 0 | 1, transitionDurationMs: number]
        >;
    };

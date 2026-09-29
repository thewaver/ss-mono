import type { Ref, VNodeChild } from "vue";

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
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { ColorInputCbs };

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

export type ColorInputProps = Omit<InteractionWrapperProps<ColorInputRenderProps>, "extraFlags"> &
    ColorInputCbs &
    Pick<InteractionControlProps<ColorInputRenderProps>, "id"> &
    ColorInputState & {
        /**
         * The color. It is the only thing that changes it, and the field writes back in the notation it was handed —
         * a hex stays a hex.
         */
        "value": string;
        /** Receives the color as it changes, in the notation it was handed, which is what `v-model:value` binds. */
        "onUpdate:value"?: (value: string) => void;
        /**
         * Whether the picker is open. It is the only thing that opens or closes it. Leave it out and the field holds
         * its own, starting closed.
         */
        "visibility"?: boolean;
        /** Receives the picker opening or closing, which is what `v-model:visibility` binds. */
        "onUpdate:visibility"?: (isOpen: boolean) => void;
    };

export type ColorInputSlots = Pick<InteractionWrapperSlots<ColorInputRenderProps>, "renderDecoration"> &
    InteractionControlSlots<ColorInputRenderProps> & {
        /** Draws the saturation and brightness square. */
        renderArea: (flags: InteractionFlags<ColorAreaRenderProps>) => VNodeChild;
        /** Draws the hue slider. */
        renderHue: (flags: InteractionFlags<RangeRenderProps>) => VNodeChild;
        /**
         * Draws the surface the picker sits on. The picker is handed in rather than built, so the consumer decides
         * what surrounds it, and the color is handed in as the channels the picker moves in, as a writable ref, so
         * anything else put beside it — a preview, a field per channel — writes the same color.
         */
        renderPopup: (props: {
            renderSurface: () => VNodeChild;
            hsv: Ref<Color.HSVA>;
            visibilityTarget: 0 | 1;
            transitionDurationMs: number;
        }) => VNodeChild;
    };

import type { JSX, Signal } from "solid-js";

import type { Color } from "@thewaver/ss-utils";
import type { Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../InteractionWrapper/InteractionWrapper.types";
import type { ColorAreaRenderProps } from "../ColorArea/ColorArea.types";
import type { RangeRenderProps } from "../Range/Range.types";

export type ColorInputRenderProps = {
    value: string;
    hsv: Color.HSVA;
    isOpen: boolean;
};

export type ColorInputCbs = {
    onInput?: (value: string) => void | Promise<void>;
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type ColorInputState = {
    name?: string;
    ariaLabel?: string;
    areaLabel?: string;
    hueLabel?: string;
    placement?: AnchorPlacement;
    offset?: Point2d;
    transitionDurationMs?: number;
};

export type ColorInputFieldProps = AccessorProps<
    ColorInputCbs &
        InteractionControlProps<ColorInputRenderProps> &
        Pick<ColorInputState, "ariaLabel"> & {
            popupId: string;
            isOpen: boolean;
            onToggle: () => void;
        }
>;

export type ColorInputProps = Omit<InteractionWrapperProps<ColorInputRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        ColorInputCbs &
            Pick<InteractionControlProps<ColorInputRenderProps>, "id" | "renderContent"> &
            ColorInputState & {
                valueSignal: SignalSource<string>;
                visibilitySignal?: SignalSource<boolean>;
                renderArea: (getRenderProps: () => InteractionFlags<ColorAreaRenderProps>) => JSX.Element;
                renderHue: (getRenderProps: () => InteractionFlags<RangeRenderProps>) => JSX.Element;
                renderPopup: (
                    renderSurface: () => JSX.Element,
                    hsvSignal: Signal<Color.HSVA>,
                    getVisibilityTarget: () => 0 | 1,
                    getTransitionDurationMs: () => number,
                ) => JSX.Element;
            }
    >;

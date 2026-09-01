import type { Color } from "@thewaver/ss-utils";

import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../InteractionWrapper/InteractionWrapper.types";

export type ColorAreaAxis = "saturation" | "brightness";

export type ColorAreaRenderProps = {
    hsv: Color.HSVA;
    isDragging: boolean;
    focusVisibleAxis?: ColorAreaAxis;
};

export type ColorAreaCbs = {
    onInput?: (hsv: Color.HSVA) => void | Promise<void>;
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type ColorAreaState = {
    name?: string;
    ariaLabel?: string;
    axisLabels?: Record<ColorAreaAxis, string>;
    step?: number;
};

export type ColorAreaElementProps = AccessorProps<
    ColorAreaCbs &
        InteractionControlProps<ColorAreaRenderProps> &
        Required<Omit<ColorAreaState, "name" | "ariaLabel">> &
        Pick<ColorAreaState, "name" | "ariaLabel"> & {
            hsv: Color.HSVA;
            isTabbable?: boolean;
            setAxis: (axis: ColorAreaAxis, ratio: number) => void;
            setFocusVisibleAxis: (axis?: ColorAreaAxis) => void;
            setIsDragging: (isDragging: boolean) => void;
        }
>;

export type ColorAreaProps = Omit<InteractionWrapperProps<ColorAreaRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        ColorAreaCbs &
            Pick<InteractionControlProps<ColorAreaRenderProps>, "id" | "renderContent"> &
            ColorAreaState & {
                hsvSignal: SignalSource<Color.HSVA>;
            }
    >;

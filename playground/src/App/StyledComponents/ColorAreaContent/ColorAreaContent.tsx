import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    ColorAreaContentProps,
    ColorFieldTriggerProps,
    ColorSwatchProps,
    HueSliderProps,
} from "./ColorAreaContent.types";

import * as styles from "./ColorAreaContent.css";

const PERCENT = 100;

export const PageColorAreaContent = (props: ColorAreaContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.colorAreaSquare}
            classList={{
                [getLayerClass()]: true,
                [styles.isDragging]: access(props.renderProps).isDragging,
                [styles.isFocused]: access(props.renderProps).focusVisibleAxis !== undefined,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            style={{
                ...assignInlineVars({
                    [styles.hueVar]: `${access(props.renderProps).hsv.h}deg`,
                    [styles.thumbXVar]: `${access(props.renderProps).hsv.s}%`,
                    [styles.thumbYVar]: `${PERCENT - access(props.renderProps).hsv.v}%`,
                }),
                height: `${access(props.size)}px`,
            }}
        >
            <div class={styles.colorAreaThumb} />
        </div>
    );
};

const HUE_THUMB_SIZE = 18;
const HUE_MAX = 360;

export const PageHueSlider = (props: HueSliderProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.hueSlider, getLayerClass()].join(" ")}>
            <div class={styles.hueTrack} />

            <div
                class={styles.hueThumb}
                classList={{ [styles.isFocused]: access(props.renderProps).focusVisibleThumb === 0 }}
                style={{
                    ...assignInlineVars({
                        [styles.swatchVar]: `hsl(${access(props.renderProps).values[0] % HUE_MAX} 100% 50%)`,
                    }),
                    left: `calc(${access(props.renderProps).ratios[0]} * (100% - ${HUE_THUMB_SIZE}px))`,
                }}
            />
        </div>
    );
};

export const PageColorSwatch = (props: ColorSwatchProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.colorSwatchChecker, getLayerClass()].join(" ")}>
            <div class={styles.colorSwatch} style={assignInlineVars({ [styles.swatchVar]: access(props.value) })} />
        </div>
    );
};

export const PageColorChannelGrid = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.colorChannels, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageColorChannel = (props: ParentProps<{ label: string }>) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.colorChannel, getLayerClass()].join(" ")}>
            <div class={styles.colorChannelLabel} aria-hidden="true">
                {props.label}
            </div>

            {props.children}
        </div>
    );
};

export const PageColorPickerPopup = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.colorPickerPopup, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageColorPickerRow = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.colorPickerRow, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageColorFieldTrigger = (props: ParentProps<ColorFieldTriggerProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.colorFieldTrigger}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
        >
            {props.children}
        </div>
    );
};

export const PageColorPreview = (props: ColorSwatchProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.colorPreviewChecker, getLayerClass()].join(" ")}>
            <div class={styles.colorPreview} style={assignInlineVars({ [styles.swatchVar]: access(props.value) })} />
        </div>
    );
};

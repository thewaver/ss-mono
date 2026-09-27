import type { CSSProperties, PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    ColorAreaContentProps,
    ColorFieldTriggerProps,
    ColorSwatchProps,
    HueSliderProps,
} from "./ColorAreaContent.types";

const PERCENT = 100;

export const PageColorAreaContent = (props: ColorAreaContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.colorAreaSquare,
                layerClass,
                props.renderProps.isDragging && styles.isDragging,
                props.renderProps.focusVisibleAxis !== undefined && styles.isFocused,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                ...(assignInlineVars({
                    [styles.hueVar]: `${props.renderProps.hsv.h}deg`,
                    [styles.thumbXVar]: `${props.renderProps.hsv.s}%`,
                    [styles.thumbYVar]: `${PERCENT - props.renderProps.hsv.v}%`,
                }) as CSSProperties),
                height: `${props.size}px`,
            }}
        >
            <div className={styles.colorAreaThumb} />
        </div>
    );
};

const HUE_THUMB_SIZE = 18;
const HUE_MAX = 360;

export const PageHueSlider = (props: HueSliderProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.hueSlider, layerClass].join(" ")}>
            <div className={styles.hueTrack} />

            <div
                className={[styles.hueThumb, props.renderProps.focusVisibleThumb === 0 && styles.isFocused]
                    .filter(Boolean)
                    .join(" ")}
                style={{
                    ...(assignInlineVars({
                        [styles.swatchVar]: `hsl(${props.renderProps.values[0] % HUE_MAX} 100% 50%)`,
                    }) as CSSProperties),
                    left: `calc(${props.renderProps.ratios[0]} * (100% - ${HUE_THUMB_SIZE}px))`,
                }}
            />
        </div>
    );
};

export const PageColorSwatch = (props: ColorSwatchProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.colorSwatchChecker, layerClass].join(" ")}>
            <div
                className={styles.colorSwatch}
                style={assignInlineVars({ [styles.swatchVar]: props.value }) as CSSProperties}
            />
        </div>
    );
};

export const PageColorChannelGrid = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.colorChannels, layerClass].join(" ")}>{props.children}</div>;
};

export const PageColorChannel = (props: PropsWithChildren<{ label: string }>) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.colorChannel, layerClass].join(" ")}>
            <div className={styles.colorChannelLabel} aria-hidden="true">
                {props.label}
            </div>

            {props.children}
        </div>
    );
};

export const PageColorPickerPopup = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.colorPickerPopup, layerClass].join(" ")}>{props.children}</div>;
};

export const PageColorPickerRow = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.colorPickerRow, layerClass].join(" ")}>{props.children}</div>;
};

export const PageColorFieldTrigger = (props: PropsWithChildren<ColorFieldTriggerProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.colorFieldTrigger,
                layerClass,
                props.flags.isHovered && styles.isHovered,
                props.flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

export const PageColorPreview = (props: ColorSwatchProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.colorPreviewChecker, layerClass].join(" ")}>
            <div
                className={styles.colorPreview}
                style={assignInlineVars({ [styles.swatchVar]: props.value }) as CSSProperties}
            />
        </div>
    );
};

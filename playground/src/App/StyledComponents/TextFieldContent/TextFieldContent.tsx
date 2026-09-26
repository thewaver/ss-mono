import type { InteractionFlags, TextFieldTextStyle } from "@thewaver/ss-components";
import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldContentProps } from "./TextFieldContent.types";

import { themeVars } from "../../Theme.css";
import { layerVars } from "../Layer/Layer.css";
import * as styles from "./TextFieldContent.css";

export const computePageTextFieldTextStyle = (getFlags: () => InteractionFlags): TextFieldTextStyle => ({
    "color": getFlags().isDisabled ? `rgb(from ${layerVars.contrast} r g b / 50%)` : layerVars.contrast,
    "caret-color": themeVars.color.primary.main,
    "font-size": styles.FIELD_FONT_SIZE,
    "line-height": styles.FIELD_LINE_HEIGHT,
});

export const PageTextFieldContent = (props: TextFieldContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.textFieldContent}
            style={{
                width: props.width ? `${access(props.width)}px` : undefined,
                height: props.height ? `${access(props.height)}px` : undefined,
            }}
            classList={{
                [getLayerClass()]: true,
                [styles.isStretched]: access(props.isStretched),
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isReadOnly]: access(props.flags).isReadOnly,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.hasError]: access(props.flags).hasError,
            }}
        />
    );
};

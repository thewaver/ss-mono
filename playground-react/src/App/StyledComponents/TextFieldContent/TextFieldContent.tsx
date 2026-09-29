import type { InteractionFlags, TextFieldTextStyle } from "@thewaver/ss-components-react";
import { layerVars } from "@thewaver/ss-playground/App/StyledComponents/Layer/Layer.css";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldContentProps } from "./TextFieldContent.types";

export const computePageTextFieldTextStyle = (flags: InteractionFlags): TextFieldTextStyle => ({
    color: flags.isDisabled ? `rgb(from ${layerVars.contrast} r g b / 50%)` : layerVars.contrast,
    caretColor: themeVars.color.primary.main,
    fontSize: styles.FIELD_FONT_SIZE,
    lineHeight: styles.FIELD_LINE_HEIGHT,
});

export const PageTextFieldContent = (props: TextFieldContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.textFieldContent,
                layerClass,
                props.isStretched && styles.isStretched,
                props.flags.isHovered && styles.isHovered,
                props.flags.isReadOnly && styles.isReadOnly,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                width: props.width ? `${props.width}px` : undefined,
                height: props.height ? `${props.height}px` : undefined,
            }}
        />
    );
};

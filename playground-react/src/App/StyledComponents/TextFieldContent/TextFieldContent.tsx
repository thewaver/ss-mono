import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldContentProps } from "./TextFieldContentReact.types";

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

import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldAdornment/TextFieldAdornment.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldAdornmentProps } from "./TextFieldAdornment.types";

export const PageTextFieldAdornment = (props: PropsWithChildren<TextFieldAdornmentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.textFieldAdornment,
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

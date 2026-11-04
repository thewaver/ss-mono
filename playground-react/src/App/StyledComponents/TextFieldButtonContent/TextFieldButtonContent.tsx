import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldButtonContent/TextFieldButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldButtonContentProps } from "./TextFieldButtonContentReact.types";

export const PageTextFieldButtonContent = (props: PropsWithChildren<TextFieldButtonContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.textFieldButtonContent,
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

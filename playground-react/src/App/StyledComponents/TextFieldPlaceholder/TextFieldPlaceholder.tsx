import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldPlaceholderProps } from "./TextFieldPlaceholder.types";

export const PageTextFieldPlaceholder = (props: PropsWithChildren<TextFieldPlaceholderProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.textFieldPlaceholder,
                layerClass,
                props.isTopAligned && styles.isTopAligned,
                props.flags.isEmpty && styles.isEmpty,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};

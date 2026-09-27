import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldAdornment/TextFieldAdornment.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldAdornmentProps } from "./TextFieldAdornment.types";

export const PageTextFieldAdornment = (props: ParentProps<TextFieldAdornmentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.textFieldAdornment}
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

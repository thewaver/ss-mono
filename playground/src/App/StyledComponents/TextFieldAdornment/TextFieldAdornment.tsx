import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldAdornmentProps } from "./TextFieldAdornment.types";

import * as styles from "./TextFieldAdornment.css";

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

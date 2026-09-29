import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldPlaceholderProps } from "./TextFieldPlaceholder.types";

export const PageTextFieldPlaceholder = (props: ParentProps<TextFieldPlaceholderProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.textFieldPlaceholder}
            classList={{
                [getLayerClass()]: true,
                [styles.isTopAligned]: access(props.isTopAligned),
                [styles.isEmpty]: access(props.flags).isEmpty,
            }}
            aria-hidden="true"
        >
            {props.children}
        </div>
    );
};

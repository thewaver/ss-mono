import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldButtonContent/TextFieldButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldButtonContentProps } from "./TextFieldButtonContentSolid.types";

export const PageTextFieldButtonContent = (props: ParentProps<TextFieldButtonContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.textFieldButtonContent}
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

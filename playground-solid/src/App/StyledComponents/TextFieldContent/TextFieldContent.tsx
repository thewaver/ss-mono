import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TextFieldContentProps } from "./TextFieldContentSolid.types";

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

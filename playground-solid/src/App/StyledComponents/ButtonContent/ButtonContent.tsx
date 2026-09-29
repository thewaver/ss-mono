import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ButtonContent/ButtonContent.css";

import type { ButtonContentProps } from "./ButtonContent.types";

export const PageButtonContent = (props: ParentProps<ButtonContentProps>) => {
    return (
        <div
            class={styles.buttonContent}
            classList={{
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isDisabled]: access(props.flags).isDisabled,
                [styles.hasError]: access(props.flags).hasError,
            }}
        >
            {props.children}
        </div>
    );
};

import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ButtonContent/ButtonContent.css";

import type { ButtonContentProps } from "./ButtonContent.types";

export const PageButtonContent = (props: PropsWithChildren<ButtonContentProps>) => {
    return (
        <div
            className={[
                styles.buttonContent,
                props.flags.isHovered && styles.isHovered,
                props.flags.isActive && styles.isActive,
                props.flags.isDisabled && styles.isDisabled,
                props.flags.hasError && styles.hasError,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

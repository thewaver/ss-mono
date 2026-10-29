import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalOverlay/ModalOverlay.css";

import type { ModalOverlayProps } from "./ModalOverlayReact.types";

export const PageModalOverlay = (props: ModalOverlayProps) => {
    const variants = props.isOpaque ? styles.opaqueOverlayVariants : styles.blurredOverlayVariants;

    return (
        <div
            className={variants[props.visibilityTarget === 1 ? "on" : "off"]}
            style={{
                transition: `backdrop-filter ${props.transitionDurationMs}ms, opacity ${props.transitionDurationMs}ms`,
            }}
        />
    );
};

import { access } from "@thewaver/ss-components";

import type { ModalOverlayProps } from "./ModalOverlay.types";

import * as styles from "./ModalOverlay.css";

export const PageModalOverlay = (props: ModalOverlayProps) => {
    return (
        <div
            class={access(props.visibilityTarget) === 1 ? styles.overlayOn : styles.overlayOff}
            style={{
                transition: `backdrop-filter ${access(props.transitionDurationMs)}ms`,
            }}
        />
    );
};

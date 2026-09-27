import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/ModalOverlay/ModalOverlay.css";

import type { ModalOverlayProps } from "./ModalOverlay.types";

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

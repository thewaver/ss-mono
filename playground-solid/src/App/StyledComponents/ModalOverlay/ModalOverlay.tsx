import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalOverlay/ModalOverlay.css";

import type { ModalOverlayProps } from "./ModalOverlaySolid.types";

export const PageModalOverlay = (props: ModalOverlayProps) => {
    const getVariants = () => (access(props.isOpaque) ? styles.opaqueOverlayVariants : styles.blurredOverlayVariants);

    const getDurationMs = () => access(props.transitionDurationMs);

    return (
        <div
            class={getVariants()[access(props.visibilityTarget) === 1 ? "on" : "off"]}
            style={{ transition: `backdrop-filter ${getDurationMs()}ms, opacity ${getDurationMs()}ms` }}
        />
    );
};

import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/SpotlightPopup/SpotlightPopup.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { SpotlightPopupProps } from "./SpotlightPopup.types";

export const PageSpotlightPopup = (props: PropsWithChildren<SpotlightPopupProps>) => {
    return (
        <div
            className={styles.spotlightPopup}
            style={{
                opacity: props.visibilityTarget,
                transition: `opacity ${props.transitionDurationMs}ms`,
            }}
        >
            <div className={styles.spotlightPopupTitle}>{props.title}</div>
            <PageLayer level={2}>{props.children}</PageLayer>
        </div>
    );
};

export const PageSpotlightPopupText = (props: PropsWithChildren) => (
    <div className={styles.spotlightPopupText}>{props.children}</div>
);

export const PageSpotlightPopupActions = (props: PropsWithChildren) => (
    <div className={styles.spotlightPopupActions}>{props.children}</div>
);

import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { SpotlightPopupProps } from "./SpotlightPopup.types";

import * as styles from "./SpotlightPopup.css";

export const PageSpotlightPopup = (props: ParentProps<SpotlightPopupProps>) => {
    return (
        <div
            class={styles.spotlightPopup}
            style={{
                opacity: access(props.visibilityTarget),
                transition: `opacity ${access(props.transitionDurationMs)}ms`,
            }}
        >
            <div class={styles.spotlightPopupTitle}>{access(props.title)}</div>
            <PageLayer level={2}>{props.children}</PageLayer>
        </div>
    );
};

export const PageSpotlightPopupText = (props: ParentProps) => (
    <div class={styles.spotlightPopupText}>{props.children}</div>
);

export const PageSpotlightPopupActions = (props: ParentProps) => (
    <div class={styles.spotlightPopupActions}>{props.children}</div>
);

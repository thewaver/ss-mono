import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/SpotlightPopup/SpotlightPopup.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { SpotlightPopupProps } from "./SpotlightPopupReact.types";

export const PageSpotlightPopup = (props: PropsWithChildren<SpotlightPopupProps>) => {
    const layerClass = useNextLayerClass();

    return (
        <div
            className={[styles.spotlightPopup, layerClass].join(" ")}
            style={{
                opacity: props.visibilityTarget,
                transition: `opacity ${props.transitionDurationMs}ms`,
            }}
        >
            <div className={styles.spotlightPopupTitle}>{props.title}</div>
            <PageLayer>{props.children}</PageLayer>
        </div>
    );
};

export const PageSpotlightPopupText = (props: PropsWithChildren) => (
    <div className={styles.spotlightPopupText}>{props.children}</div>
);

export const PageSpotlightPopupActions = (props: PropsWithChildren) => (
    <div className={styles.spotlightPopupActions}>{props.children}</div>
);

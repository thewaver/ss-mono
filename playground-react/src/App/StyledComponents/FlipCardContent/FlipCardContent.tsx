import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlipCardContent/FlipCardContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FlipCardFaceProps } from "./FlipCardContent.types";

export const PageFlipCardFront = (props: PropsWithChildren<FlipCardFaceProps>) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.flipCardFront, layerClass].join(" ")}>
            <div className={styles.flipCardTitle}>{props.children}</div>
            <div className={styles.flipCardBody}>{props.state.isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageFlipCardBack = (props: PropsWithChildren<FlipCardFaceProps>) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.flipCardBack, layerClass].join(" ")}>
            <div className={styles.flipCardTitle}>{props.children}</div>
            <div className={styles.flipCardBody}>{props.state.isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageFlipCardStack = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.flipCardStack, layerClass].join(" ")}>{props.children}</div>;
};

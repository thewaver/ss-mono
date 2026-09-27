import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/CuboidContent/CuboidContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CuboidFaceProps } from "./CuboidContent.types";

export const PageCuboidFace = (props: CuboidFaceProps) => {
    const layerClass = useLayerClass();

    return (
        <div className={[styles.cuboidFace[props.face], layerClass].join(" ")}>
            <div className={styles.cuboidFaceTitle}>{props.face}</div>
            <div className={styles.cuboidFaceBody}>{props.state.isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageCuboidStack = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.cuboidStack, layerClass].join(" ")}>{props.children}</div>;
};

export const PageCuboidPad = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.cuboidPad, layerClass].join(" ")}>{props.children}</div>;
};

export const PageCuboidRow = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.cuboidRow, layerClass].join(" ")}>{props.children}</div>;
};

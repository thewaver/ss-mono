import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CuboidContent/CuboidContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CuboidFaceProps } from "./CuboidContent.types";

export const PageCuboidFace = (props: CuboidFaceProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.cuboidFace[access(props.face)], getLayerClass()].join(" ")}>
            <div class={styles.cuboidFaceTitle}>{access(props.face)}</div>
            <div class={styles.cuboidFaceBody}>{access(props.state).isShowing ? "facing you" : "turned away"}</div>
        </div>
    );
};

export const PageCuboidStack = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.cuboidStack, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageCuboidPad = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.cuboidPad, getLayerClass()].join(" ")}>{props.children}</div>;
};

export const PageCuboidRow = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.cuboidRow, getLayerClass()].join(" ")}>{props.children}</div>;
};

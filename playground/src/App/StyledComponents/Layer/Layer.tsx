import type { ParentProps } from "solid-js";

import { useLayerClass } from "./Layer.context";

import * as styles from "./Layer.css";

export const PageLayerScope = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.layerScope, getLayerClass()].join(" ")}>{props.children}</div>;
};

import type { ParentProps } from "solid-js";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/Layer/Layer.css";

import { useLayerClass } from "./Layer.context";

export const PageLayerScope = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.layerScope, getLayerClass()].join(" ")}>{props.children}</div>;
};

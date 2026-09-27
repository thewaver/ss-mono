import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/Layer/Layer.css";

import { useLayerClass } from "./Layer.context";

export const PageLayerScope = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.layerScope, layerClass].join(" ")}>{props.children}</div>;
};

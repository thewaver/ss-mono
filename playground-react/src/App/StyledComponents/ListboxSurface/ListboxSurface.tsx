import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/ListboxSurface/ListboxSurface.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ListboxSurfaceProps } from "./ListboxSurface.types";

export const PageListboxSurface = (props: PropsWithChildren<ListboxSurfaceProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.listboxSurface, layerClass, props.isWide === true && styles.listboxSurfaceWide]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

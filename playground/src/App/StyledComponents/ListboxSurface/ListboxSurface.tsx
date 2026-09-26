import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { ListboxSurfaceProps } from "./ListboxSurface.types";

import * as styles from "./ListboxSurface.css";

export const PageListboxSurface = (props: ParentProps<ListboxSurfaceProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.listboxSurface}
            classList={{ [getLayerClass()]: true, [styles.listboxSurfaceWide]: access(props.isWide) === true }}
        >
            {props.children}
        </div>
    );
};

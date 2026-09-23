import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { ListboxSurfaceProps } from "./ListboxSurface.types";

import * as styles from "./ListboxSurface.css";

export const PageListboxSurface = (props: ParentProps<ListboxSurfaceProps>) => {
    return (
        <div class={styles.listboxSurface} classList={{ [styles.listboxSurfaceWide]: access(props.isWide) === true }}>
            {props.children}
        </div>
    );
};

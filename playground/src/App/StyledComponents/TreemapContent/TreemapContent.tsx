import { For } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTreemapBarProps, PageTreemapTileProps } from "./TreemapContent.types";

import * as styles from "./TreemapContent.css";

const WORD_START = /(?=[A-Z][^A-Z])/g;

export const PageTreemapTile = (props: PageTreemapTileProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.treemapTile}
            classList={{ [getLayerClass()]: true, [styles.treemapTileBranch]: access(props.isBranch) }}
        >
            <For each={access(props.name).split(WORD_START)}>{(word) => <span>{word}</span>}</For>

            <span class={styles.treemapTileWeight}>{access(props.weight)}</span>
        </div>
    );
};

export const PageTreemapBar = (props: PageTreemapBarProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.treemapBar}
            classList={{
                [getLayerClass()]: true,
                [styles.treemapBarHovered]: access(props.flags).isHovered,
                [styles.treemapBarAtRoot]: access(props.flags).isDisabled,
            }}
        >
            <span class={styles.treemapBarPath}>{access(props.path)}</span>

            <span class={styles.treemapTileWeight}>{access(props.weight)}</span>
        </div>
    );
};

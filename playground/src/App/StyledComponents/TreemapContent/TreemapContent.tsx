import { For } from "solid-js";

import { access } from "@thewaver/ss-components";

import type { PageTreemapBarProps, PageTreemapTileProps } from "./TreemapContent.types";

import * as styles from "./TreemapContent.css";

const WORD_START = /(?=[A-Z][^A-Z])/g;

export const PageTreemapTile = (props: PageTreemapTileProps) => {
    return (
        <div class={styles.treemapTile} classList={{ [styles.treemapTileBranch]: access(props.isBranch) }}>
            <For each={access(props.name).split(WORD_START)}>{(word) => <span>{word}</span>}</For>

            <span class={styles.treemapTileWeight}>{access(props.weight)}</span>
        </div>
    );
};

export const PageTreemapBar = (props: PageTreemapBarProps) => {
    return (
        <div
            class={styles.treemapBar}
            classList={{
                [styles.treemapBarHovered]: access(props.flags).isHovered,
                [styles.treemapBarAtRoot]: access(props.flags).isDisabled,
            }}
        >
            <span class={styles.treemapBarPath}>{access(props.path)}</span>

            <span class={styles.treemapTileWeight}>{access(props.weight)}</span>
        </div>
    );
};

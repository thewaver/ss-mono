import type { BracketLayerHeaderState, BracketNode, BracketNodeState } from "@thewaver/ss-components-react";
import { ROOT_LAYER } from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

export * from "@thewaver/ss-playground/App/Pages/BracketPage/BracketNodes.const";

export const renderBracketNode = (node: BracketNode<string>, state: BracketNodeState) => (
    <div
        className={[
            styles.node,
            state.isOnFocusedRoute && styles.nodeOnRoute,
            state.placement.layer === ROOT_LAYER && styles.nodeRoot,
            state.placement.isDisabled && styles.nodeDisabled,
        ]
            .filter(Boolean)
            .join(" ")}
    >
        {node.value}
    </div>
);

export const computeBracketLayerHeader = (names: string[]) => (layer: number) => (
    <div className={styles.layerHeader}>{names[layer]}</div>
);

export const computeBracketPinnedLayerHeader = (names: string[]) => (layer: number, state: BracketLayerHeaderState) => (
    <div
        className={[styles.layerHeader, styles.pinnedLayerHeader, state.isCurrent && styles.layerHeaderCurrent]
            .filter(Boolean)
            .join(" ")}
    >
        {names[layer]}
    </div>
);

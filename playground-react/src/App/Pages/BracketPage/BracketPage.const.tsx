import type { BracketNode, BracketNodeState } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

const ROOT_LAYER = 0;

export * from "@thewaver/ss-playground/App/Pages/BracketPage/BracketNodes.const";

export const renderBracketNode = (node: BracketNode<string>, state: BracketNodeState) => (
    <div
        className={[
            styles.node,
            state.isFocused && styles.nodeFocused,
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

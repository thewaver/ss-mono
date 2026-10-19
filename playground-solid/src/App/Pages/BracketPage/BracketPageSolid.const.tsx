import type { Accessor } from "solid-js";

import type { BracketLayerHeaderState, BracketNode, BracketNodeState } from "@thewaver/ss-components-solid";
import { ROOT_LAYER } from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

export * from "@thewaver/ss-playground/App/Pages/BracketPage/BracketNodes.const";

export const renderBracketNode = (getNode: Accessor<BracketNode<string>>, getState: Accessor<BracketNodeState>) => (
    <div
        class={styles.node}
        classList={{
            [styles.nodeOnRoute]: getState().isOnFocusedRoute,
            [styles.nodeRoot]: getState().placement.layer === ROOT_LAYER,
            [styles.nodeDisabled]: getState().placement.isDisabled,
        }}
    >
        {getNode().value}
    </div>
);

export const computeBracketLayerHeader = (names: string[]) => (layer: number) => (
    <div class={styles.layerHeader}>{names[layer]}</div>
);

export const computeBracketCurrentLayerHeader =
    (names: string[]) => (layer: number, getState: Accessor<BracketLayerHeaderState>) => (
        <div class={styles.layerHeader} classList={{ [styles.layerHeaderCurrent]: getState().isCurrent }}>
            {names[layer]}
        </div>
    );

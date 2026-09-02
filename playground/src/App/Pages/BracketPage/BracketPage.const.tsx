import type { Accessor } from "solid-js";

import type { BracketNode, BracketNodeState } from "@thewaver/ss-components";

import * as styles from "./BracketPage.css";

const ROOT_LAYER = 0;

export const NOTHING_PICKED = "nothing picked yet";

export const seed = (value: string): BracketNode<string> => ({ value });

export const branch = (value: string, ...children: BracketNode<string>[]): BracketNode<string> => ({
    value,
    children,
});

export const renderBracketNode = (getNode: Accessor<BracketNode<string>>, getState: Accessor<BracketNodeState>) => (
    <div
        class={styles.node}
        classList={{
            [styles.nodeFocused]: getState().isFocused,
            [styles.nodeRoot]: getState().placement.layer === ROOT_LAYER,
            [styles.nodeDisabled]: getState().placement.isDisabled,
        }}
    >
        {getNode().value}
    </div>
);

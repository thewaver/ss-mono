import type { ParentProps } from "solid-js";
import { Show } from "solid-js";

import { access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type { TreeNodeContentProps, TreeNodePendingProps } from "./TreeNodeContent.types";

import { themeVars } from "../../Theme.css";
import * as styles from "./TreeNodeContent.css";

const INDENT_PER_DEPTH = 20;
const BRANCH_MARKER = "▶";
const LEAF_MARKER = "•";
const DESCRIPTION_ONLY_MARKER = "·";
const ROOT_RANK_DEPTH = 0;
const INNER_RANK_DEPTH = 1;

export const PageTreeNodeContent = (props: ParentProps<TreeNodeContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.treeNodeContent}
            style={{
                "padding-left": `calc(${themeVars.spacing.half} + ${access(props.renderProps).depth * INDENT_PER_DEPTH}px)`,
            }}
            classList={{
                [getLayerClass()]: true,
                [styles.isBranch]: access(props.renderProps).isBranch,
                [styles.isExpanded]: access(props.renderProps).isExpanded,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isSelected]: access(props.renderProps).isSelected,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
                [styles.isCategory]: access(props.renderProps).depth === 0,
            }}
        >
            <div class={styles.treeNodeMarker} aria-hidden="true">
                {access(props.renderProps).isBranch
                    ? BRANCH_MARKER
                    : (access(props.hasExamples) ?? true)
                      ? LEAF_MARKER
                      : DESCRIPTION_ONLY_MARKER}
            </div>

            <div>{props.children}</div>

            <Show when={access(props.detail)}>
                {(getDetail) => <div class={styles.treeNodeDetail}>{getDetail()}</div>}
            </Show>
        </div>
    );
};

export const PageTreeNodePending = (props: ParentProps<TreeNodePendingProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[styles.treeNodePending, getLayerClass()].join(" ")}
            style={{
                "padding-left": `calc(${themeVars.spacing.half} + ${access(props.depth) * INDENT_PER_DEPTH}px)`,
            }}
        >
            <div class={styles.treeNodeMarker} aria-hidden="true">
                {LEAF_MARKER}
            </div>

            <div>{props.children}</div>
        </div>
    );
};

export const PageTreeRadialNode = (props: ParentProps<TreeNodeContentProps>) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.treeRadialNode}
            classList={{
                [getLayerClass()]: true,
                [styles.isRootRank]: access(props.renderProps).depth === ROOT_RANK_DEPTH,
                [styles.isOuterRank]: access(props.renderProps).depth > INNER_RANK_DEPTH,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isSelected]: access(props.renderProps).isSelected,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
        >
            {props.children}
        </div>
    );
};

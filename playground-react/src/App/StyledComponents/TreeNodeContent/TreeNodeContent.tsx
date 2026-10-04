import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TreeNodeContentProps, TreeNodePendingProps } from "./TreeNodeContent.types";

const INDENT_PER_DEPTH = 20;
const BRANCH_MARKER = "▶";
const LEAF_MARKER = "•";
const DESCRIPTION_ONLY_MARKER = "·";
const ROOT_RANK_DEPTH = 0;
const INNER_RANK_DEPTH = 1;

export const PageTreeNodeContent = (props: PropsWithChildren<TreeNodeContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.treeNodeContent,
                layerClass,
                props.renderProps.isBranch && styles.isBranch,
                props.renderProps.isExpanded && styles.isExpanded,
                !props.isGliding && props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isSelected && styles.isSelected,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.depth === 0 && styles.isCategory,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                paddingLeft: `calc(${themeVars.spacing.half} + ${props.renderProps.depth * INDENT_PER_DEPTH}px)`,
            }}
        >
            <div className={styles.treeNodeMarker} aria-hidden="true">
                {props.renderProps.isBranch
                    ? BRANCH_MARKER
                    : (props.hasExamples ?? true)
                      ? LEAF_MARKER
                      : DESCRIPTION_ONLY_MARKER}
            </div>

            <div>{props.children}</div>

            {props.detail ? <div className={styles.treeNodeDetail}>{props.detail}</div> : null}
        </div>
    );
};

export const PageTreeNodePending = (props: PropsWithChildren<TreeNodePendingProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.treeNodePending, layerClass].join(" ")}
            style={{
                paddingLeft: `calc(${themeVars.spacing.half} + ${props.depth * INDENT_PER_DEPTH}px)`,
            }}
        >
            <div className={styles.treeNodeMarker} aria-hidden="true">
                {LEAF_MARKER}
            </div>

            <div>{props.children}</div>
        </div>
    );
};

export const PageTreeRadialNode = (props: PropsWithChildren<TreeNodeContentProps>) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.treeRadialNode,
                layerClass,
                props.renderProps.depth === ROOT_RANK_DEPTH && styles.isRootRank,
                props.renderProps.depth > INNER_RANK_DEPTH && styles.isOuterRank,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isSelected && styles.isSelected,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {props.children}
        </div>
    );
};

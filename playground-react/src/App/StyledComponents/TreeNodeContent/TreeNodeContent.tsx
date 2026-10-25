import { type PropsWithChildren, useRef } from "react";

import { NavigatorReactUtils, PlacementUtils } from "@thewaver/ss-components-react";
import {
    CHECKED_MARK,
    MIXED_MARK,
} from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.const";
import * as markStyles from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.css";
import {
    BRANCH_MARKER,
    DESCRIPTION_ONLY_MARKER,
    INDENT_PER_DEPTH,
    INNER_RANK_DEPTH,
    LEAF_MARKER,
    ROOT_RANK_DEPTH,
} from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { TreeConnectorProps, TreeNodeContentProps, TreeNodePendingProps } from "./TreeNodeContentReact.types";

export const PageTreeNodeContent = (props: PropsWithChildren<TreeNodeContentProps>) => {
    const layerClass = useLayerClass();

    const ref = useRef<HTMLDivElement | null>(null);
    const direction = NavigatorReactUtils.useDirection(ref);

    return (
        <div
            ref={ref}
            className={[
                styles.treeNodeContent,
                layerClass,
                props.renderProps.isBranch && styles.isBranch,
                props.renderProps.isExpanded && styles.isExpanded,
                !props.isGliding && props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isSelected && styles.isSelected,
                props.renderProps.isDisabled && styles.isDisabled,
                props.renderProps.depth === 0 && styles.isCategory,
                direction === "rtl" && styles.isRightToLeft,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                paddingInlineStart: `calc(${themeVars.spacing.half} + ${props.renderProps.depth * INDENT_PER_DEPTH}px)`,
            }}
        >
            <div ref={props.setExpanderRef} className={styles.treeNodeMarker} aria-hidden="true">
                {props.renderProps.isBranch
                    ? BRANCH_MARKER
                    : (props.hasExamples ?? true)
                      ? LEAF_MARKER
                      : DESCRIPTION_ONLY_MARKER}
            </div>

            {props.hasCheckbox && (
                <div
                    className={[
                        markStyles.selectGroupMark,
                        props.renderProps.checkedState === true && markStyles.isChecked,
                        props.renderProps.checkedState === "mixed" && markStyles.isMixed,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    aria-hidden="true"
                >
                    {props.renderProps.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
                </div>
            )}

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
                paddingInlineStart: `calc(${themeVars.spacing.half} + ${props.depth * INDENT_PER_DEPTH}px)`,
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

export const PageTreeConnector = (props: TreeConnectorProps) => {
    const layerClass = useLayerClass();

    const line =
        props.defs.from === undefined || props.defs.to === undefined
            ? undefined
            : PlacementUtils.getLinkPath(props.defs.from, props.defs.to);

    return line ? (
        <svg className={[styles.treeConnector, layerClass].join(" ")} viewBox={"0 0 1 1"} aria-hidden={"true"}>
            <path className={styles.treeConnectorPath} d={line} />
        </svg>
    ) : null;
};

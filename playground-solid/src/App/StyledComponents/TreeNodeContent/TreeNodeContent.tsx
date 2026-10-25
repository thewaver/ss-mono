import type { ParentProps } from "solid-js";
import { Show, createSignal } from "solid-js";

import { NavigatorSolidUtils, PlacementUtils, access } from "@thewaver/ss-components-solid";
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
import type { TreeConnectorProps, TreeNodeContentProps, TreeNodePendingProps } from "./TreeNodeContentSolid.types";

export const PageTreeNodeContent = (props: ParentProps<TreeNodeContentProps>) => {
    const getLayerClass = useLayerClass();

    const [getRef, setRef] = createSignal<HTMLElement>();
    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRef);

    return (
        <div
            ref={setRef}
            class={styles.treeNodeContent}
            style={{
                "padding-inline-start": `calc(${themeVars.spacing.half} + ${access(props.renderProps).depth * INDENT_PER_DEPTH}px)`,
            }}
            classList={{
                [getLayerClass()]: true,
                [styles.isBranch]: access(props.renderProps).isBranch,
                [styles.isExpanded]: access(props.renderProps).isExpanded,
                [styles.isHovered]: !access(props.isGliding) && access(props.renderProps).isHovered,
                [styles.isSelected]: access(props.renderProps).isSelected,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
                [styles.isCategory]: access(props.renderProps).depth === 0,
                [styles.isRightToLeft]: getDirection() === "rtl",
            }}
        >
            <div ref={(element) => props.setExpanderRef?.(element)} class={styles.treeNodeMarker} aria-hidden="true">
                {access(props.renderProps).isBranch
                    ? BRANCH_MARKER
                    : (access(props.hasExamples) ?? true)
                      ? LEAF_MARKER
                      : DESCRIPTION_ONLY_MARKER}
            </div>

            <Show when={access(props.hasCheckbox)}>
                <div
                    class={markStyles.selectGroupMark}
                    classList={{
                        [markStyles.isChecked]: access(props.renderProps).checkedState === true,
                        [markStyles.isMixed]: access(props.renderProps).checkedState === "mixed",
                    }}
                    aria-hidden="true"
                >
                    {access(props.renderProps).checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK}
                </div>
            </Show>

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
                "padding-inline-start": `calc(${themeVars.spacing.half} + ${access(props.depth) * INDENT_PER_DEPTH}px)`,
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

export const PageTreeConnector = (props: TreeConnectorProps) => {
    const getLayerClass = useLayerClass();

    const getLine = () => {
        const defs = access(props.defs);

        return defs.from === undefined || defs.to === undefined
            ? undefined
            : PlacementUtils.getLinkPath(defs.from, defs.to);
    };

    return (
        <Show when={getLine()}>
            {(getPath) => (
                <svg class={[styles.treeConnector, getLayerClass()].join(" ")} viewBox={"0 0 1 1"} aria-hidden={"true"}>
                    <path class={styles.treeConnectorPath} d={getPath()} />
                </svg>
            )}
        </Show>
    );
};

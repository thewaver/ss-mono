import type { Accessor, Component, JSX } from "solid-js";

import type { FlatRow } from "../../Abstracts/Flattener/Flattener.types";
import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";
import type { InteractionControlProps, InteractionTooltipDefs } from "../InteractionWrapper/InteractionWrapper.types";

export type TreeNodeRenderProps = {
    isBranch: boolean;
    isExpanded: boolean;
    isPending: boolean;
    isSelected: boolean;
    depth: number;
};

export type TreeLinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type TreeNode<T> = {
    value: T;
    href?: string;
    children?: TreeNode<T>[];
    hasMoreChildren?: boolean;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: InteractionTooltipDefs<TreeNodeRenderProps>;
};

export type TreeRow<T> = FlatRow<TreeNode<T>>;

export type TreeNodeItemProps = AccessorProps<
    InteractionControlProps<TreeNodeRenderProps> & {
        level: number;
        position: number;
        setSize: number;
        href: string | undefined;
        linkComponent?: Component<TreeLinkProps>;
        onActivate: () => void;
    }
>;

export type TreeProps<T> = AccessorProps<{
    ariaLabel?: string;
    linkComponent?: Component<TreeLinkProps>;
    computeEstimatedNodeHeight?: (index: number) => number;
}> & {
    nodes: MaybeAccessor<TreeNode<T>[]>;
    valueSignal: SignalSource<T | undefined>;
    expandedSignal: SignalSource<T[]>;
    computeCustomText?: (node: TreeNode<T>) => string;
    renderNode: (
        getNode: Accessor<TreeNode<T>>,
        getRenderProps: () => InteractionFlags<TreeNodeRenderProps>,
    ) => JSX.Element;
    renderPendingChildren?: (getNode: Accessor<TreeNode<T>>, getDepth: () => number) => JSX.Element;
    onSelectionChange?: (value: T) => void;
};

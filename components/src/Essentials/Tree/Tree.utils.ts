import { FlattenerUtils } from "../../Abstracts/Flattener/Flattener.utils";
import type { TreeNode, TreeRow } from "./Tree.types";

export namespace TreeUtils {
    export const getIsBranch = <T>(node: TreeNode<T>) =>
        (node.children?.length ?? 0) > 0 || (node.hasMoreChildren ?? false);

    export const getVisibleRows = <T>(nodes: TreeNode<T>[], computeIsExpanded: (value: T) => boolean): TreeRow<T>[] =>
        FlattenerUtils.getRows(nodes, {
            computeChildren: (node) => node.children,
            computeIsBranch: getIsBranch,
            computeIsExpanded: (node) => computeIsExpanded(node.value),
        });
}

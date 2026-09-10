import { FlattenerUtils } from "../../Abstracts/Flattener/Flattener.utils";
import type { TreeNode, TreeRow } from "./Tree.types";

/** Flattens a tree's nodes into the rows it draws. */
export namespace TreeUtils {
    /**
     * Whether a node can be expanded.
     *
     * A node with no children loaded is still a branch when it says there are more to come, which is
     * what lets a lazily-loaded tree show a twisty before its contents have been fetched.
     */
    export const getIsBranch = <T>(node: TreeNode<T>) =>
        (node.children?.length ?? 0) > 0 || (node.hasMoreChildren ?? false);

    /**
     * Turns the nodes into rows, skipping the contents of collapsed branches.
     *
     * @param nodes The roots, in the order they should appear.
     * @param computeIsExpanded Whether a node is open. Given the node's value rather than the node, so
     * the caller can hold the expansion state however it likes.
     * @returns The rows, nested, each carrying its depth and its position among its siblings for the
     * accessibility attributes.
     */
    export const getVisibleRows = <T>(nodes: TreeNode<T>[], computeIsExpanded: (value: T) => boolean): TreeRow<T>[] =>
        FlattenerUtils.getRows(nodes, {
            computeChildren: (node) => node.children,
            computeIsBranch: getIsBranch,
            computeIsExpanded: (node) => computeIsExpanded(node.value),
        });
}

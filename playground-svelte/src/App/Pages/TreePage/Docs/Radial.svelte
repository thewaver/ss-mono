<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";
    import type { TreeNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";
    
    import { TreePageUtils } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.utils";
    import { RADIAL_DEFS } from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";

    import PageTreeConnector from "../../../StyledComponents/TreeNodeContent/PageTreeConnector.svelte";
    import PageTreeRadialNode from "../../../StyledComponents/TreeNodeContent/PageTreeRadialNode.svelte";
    import { RANKS, RANK_ROOTS } from "../TreePage.const.svelte";

    const HALF = 0.5;

    const ROOT_DEPTH = 0;

    const toShownDepths = (nodes: TreeNode<string>[], expanded: string[], depth: number, into: Set<number>) => {
        for (const node of nodes) {
            into.add(depth);

            if (node.children !== undefined && expanded.includes(node.value)) {
                toShownDepths(node.children, expanded, depth + 1, into);
            }
        }

        return into;
    };

    let expanded = $state<string[]>(RANK_ROOTS);

    const rankRadii = $derived(
        [...toShownDepths(RANKS, expanded, ROOT_DEPTH, new Set())]
            .filter((depth) => depth > ROOT_DEPTH)
            .map((depth) => RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth),
    );

    const stageWidth = $derived(`${(Math.max(...rankRadii, ROOT_DEPTH) + RADIAL_DEFS.itemWidth * HALF) * 2}px`);
</script>

<div class={styles.rankStage}>
    {#each rankRadii as radius (radius)}
        <div
            class={styles.rankRing}
            style:width={`${radius * 2}px`}
            style:height={`${radius * 2}px`}
            aria-hidden={"true"}
        ></div>
    {/each}

    <div style:width={stageWidth}>
        <Tree nodes={RANKS} bind:expanded ariaLabel={"Ranks"} computeLayout={TreePageUtils.radialLayout}>
            {#snippet renderConnector(defs)}
                <PageTreeConnector {defs} />
            {/snippet}

            {#snippet renderNode(node, renderProps)}
                <PageTreeRadialNode {renderProps}>{node.value}</PageTreeRadialNode>
            {/snippet}
        </Tree>
    </div>
</div>

<script lang="ts">
    import { Tree } from "@thewaver/ss-components-svelte";
    import type {
        PlacementLayoutDefs,
        PlacementLayoutFn,
        PlacementRect,
        TreeNode,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.css";
    import { AngleUtils } from "@thewaver/ss-utils";

    import PageTreeRadialNode from "../../../StyledComponents/TreeNodeContent/PageTreeRadialNode.svelte";
    import { RANKS } from "../TreePage.const.svelte";
    import type { TreeExampleProps } from "../TreePage.types";

    const RADIAL_DEFS = { innerRadius: 88, ringGap: 96, itemWidth: 88, itemHeight: 88, spreadDegrees: 360 };

    const CENTER = 0.5;
    const UPWARD_DEGREES = -90;
    const CENTERD_ROOT_COUNT = 1;

    type RadialSpan = { from: number; to: number; depth: number };

    const toRadialSpans = (itemCount: number, itemParents: (number | undefined)[], spreadDegrees: number) => {
        const byParent = new Map<number | undefined, number[]>();

        for (let index = 0; index < itemCount; index++) {
            const parent = itemParents[index];
            const siblings = byParent.get(parent) ?? [];

            siblings.push(index);
            byParent.set(parent, siblings);
        }

        const spans: RadialSpan[] = Array.from({ length: itemCount }, () => ({ from: 0, to: 0, depth: 0 }));

        const assign = (parent: number | undefined, from: number, to: number, depth: number) => {
            const siblings = byParent.get(parent) ?? [];
            const step = (to - from) / Math.max(siblings.length, 1);

            siblings.forEach((child, order) => {
                const childFrom = from + step * order;

                spans[child] = { from: childFrom, to: childFrom + step, depth };
                assign(child, childFrom, childFrom + step, depth + 1);
            });
        };

        assign(undefined, UPWARD_DEGREES, UPWARD_DEGREES + spreadDegrees, 0);

        return { spans, rootCount: (byParent.get(undefined) ?? []).length };
    };

    const RADIAL_LAYOUT: PlacementLayoutFn = ({ itemCount, itemParents = [] }: PlacementLayoutDefs) => {
        const { spans, rootCount } = toRadialSpans(itemCount, itemParents, RADIAL_DEFS.spreadDegrees);
        const radiusAt = (depth: number) =>
            depth === 0 && rootCount === CENTERD_ROOT_COUNT ? 0 : RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth;
        const deepest = spans.reduce((lowest, span) => Math.max(lowest, span.depth), 0);
        const width = (radiusAt(deepest) + RADIAL_DEFS.itemWidth * CENTER) * 2;

        const placements = spans.map<PlacementRect>((span) => {
            const radians = AngleUtils.toRadians((span.from + span.to) * CENTER);
            const radius = radiusAt(span.depth);

            return {
                leftShare: CENTER + (Math.cos(radians) * radius) / width,
                topShare: CENTER + (Math.sin(radians) * radius) / width,
                widthShare: RADIAL_DEFS.itemWidth / width,
                heightShare: RADIAL_DEFS.itemHeight / width,
            };
        });

        return { placements, heightRatio: 1, pickRule: "nearest", origin: { x: CENTER, y: CENTER } };
    };

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

    type Props = TreeExampleProps;

    let { value = $bindable(), expanded = $bindable() }: Props = $props();

    const rankRadii = $derived(
        [...toShownDepths(RANKS, expanded, ROOT_DEPTH, new Set())]
            .filter((depth) => depth > ROOT_DEPTH)
            .map((depth) => RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth),
    );

    const stageWidth = $derived(`${(Math.max(...rankRadii, ROOT_DEPTH) + RADIAL_DEFS.itemWidth / 2) * 2}px`);
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
        <Tree nodes={RANKS} bind:value bind:expanded ariaLabel={"Ranks"} computeLayout={RADIAL_LAYOUT}>
            {#snippet renderNode(node, renderProps)}
                <PageTreeRadialNode {renderProps}>{node.value}</PageTreeRadialNode>
            {/snippet}
        </Tree>
    </div>
</div>

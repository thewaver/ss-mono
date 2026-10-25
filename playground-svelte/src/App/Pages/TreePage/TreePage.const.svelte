<script lang="ts" module>
    import type { Snippet } from "svelte";

    import type { TreeNode } from "@thewaver/ss-components-svelte";

    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";

    export * from "@thewaver/ss-playground/App/Pages/TreePage/TreeNodes.const";

    const toDisabledNode = (
        value: string,
        renderReason: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>,
        isReachable: boolean,
        children?: TreeNode<string>[],
    ): TreeNode<string> => ({
        value,
        children,
        isDisabled: true,
        isReachableWhenDisabled: isReachable,
        tooltipDefs: {
            placement: { x: "right_out", y: "center" },
            offset: { x: 10, y: 0 },
            renderContent: renderReason,
        },
    });

    export const createFilesWithDisabled = (isReachable: boolean): TreeNode<string>[] => [
        {
            value: "src",
            children: [
                toDisabledNode("index.ts", indexTooltip, isReachable),
                toDisabledNode("Lib", libTooltip, isReachable, [{ value: "Tree.tsx" }, { value: "Tree.utils.ts" }]),
                { value: "Playground", children: [{ value: "App.tsx" }] },
            ],
        },
        { value: "package.json" },
    ];
</script>

{#snippet indexTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Generated on build, so it cannot be picked.
    </PageTooltipContent>
{/snippet}

{#snippet libTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Locked while a release is cut. What is inside stays open to browse.
    </PageTooltipContent>
{/snippet}

<script lang="ts" module>
    import type { TreeNode } from "@thewaver/ss-components-svelte";

    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";

    export * from "@thewaver/ss-playground/App/Pages/TreePage/TreeNodes.const";

    export const FILES_WITH_REACHABLE: TreeNode<string>[] = [
        {
            value: "src",
            children: [
                { value: "index.ts" },
                {
                    value: "node_modules",
                    isDisabled: true,
                    isReachableWhenDisabled: true,
                    tooltipDefs: {
                        placement: { x: "right-out", y: "center" },
                        offset: { x: 10, y: 0 },
                        renderContent: nodeModulesTooltip,
                    },
                    children: [{ value: "solid-js" }],
                },
                { value: "Playground", children: [{ value: "App.tsx" }] },
            ],
        },
        { value: "package.json" },
    ];
</script>

{#snippet nodeModulesTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Not indexed, so this one cannot be opened.
    </PageTooltipContent>
{/snippet}

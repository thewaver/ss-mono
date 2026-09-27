import type { TreeNode } from "@thewaver/ss-components-solid";

import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";

export * from "@thewaver/ss-playground-core/App/Pages/TreePage/TreeNodes.const";

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
                    placement: () => ({ x: "right-out", y: "center" }),
                    offset: () => ({ x: 10, y: 0 }),
                    renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                        <PageTooltipContent
                            visibilityTarget={getVisibilityTarget}
                            transitionDurationMs={getTransitionDurationMs}
                        >
                            Not indexed, so this one cannot be opened.
                        </PageTooltipContent>
                    ),
                },
                children: [{ value: "solid-js" }],
            },
            { value: "Playground", children: [{ value: "App.tsx" }] },
        ],
    },
    { value: "package.json" },
];

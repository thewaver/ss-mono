import { useEffect, useRef, useState } from "react";

import type { PlacementLayoutDefs, PlacementLayoutFn, PlacementRect } from "@thewaver/ss-components";

import { Tree, type TreeLinkProps, type TreeNode, type TreeProps } from "../../src";

const INDENT_PX = 20;
const OUTSIDE_COLLAPSE_DELAY_MS = 500;
const REMOTE_LOAD_DELAY_MS = 600;
const STRESS_BRANCH_COUNT = 200;
const STRESS_LEAF_COUNT = 50;
const STRESS_NODE_HEIGHT = 28;

const FILES: TreeNode<string>[] = [
    {
        value: "src",
        children: [
            { value: "index.ts" },
            {
                value: "Lib",
                children: [
                    { value: "Tree.tsx" },
                    { value: "Tree.utils.ts" },
                    { value: "Input", children: [{ value: "Select.tsx" }, { value: "TextInput.tsx" }] },
                ],
            },
            { value: "Playground", children: [{ value: "App.tsx" }] },
        ],
    },
    { value: "package.json" },
    { value: "README.md" },
];

const FILES_WITH_DISABLED: TreeNode<string>[] = [
    {
        value: "src",
        children: [
            { value: "index.ts", isDisabled: true },
            { value: "Lib", isDisabled: true, children: [{ value: "Tree.tsx" }, { value: "Tree.utils.ts" }] },
            { value: "Playground", children: [{ value: "App.tsx" }] },
        ],
    },
    { value: "package.json" },
];

const FILES_WITH_REACHABLE: TreeNode<string>[] = [
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
                    hoverShowDelayMs: 0,
                    renderContent: () => <span>Not indexed, so this one cannot be opened.</span>,
                },
                children: [{ value: "solid-js" }],
            },
            { value: "Playground", children: [{ value: "App.tsx" }] },
        ],
    },
    { value: "package.json" },
];

const DOCS: TreeNode<string>[] = [
    {
        value: "Guides",
        children: [
            { value: "Installing", href: "#tree-installing" },
            { value: "Theming", href: "#tree-theming" },
        ],
    },
    { value: "Changelog", href: "#tree-changelog" },
];

const REMOTE_ROOT: TreeNode<string>[] = [
    { value: "packages", hasMoreChildren: true },
    { value: "docs", hasMoreChildren: true },
    { value: "README.md" },
];

const REMOTE_CHILDREN: Record<string, TreeNode<string>[]> = {
    packages: [
        { value: "core", hasMoreChildren: true },
        { value: "ui", hasMoreChildren: true },
    ],
    core: [{ value: "index.ts" }, { value: "registry.ts" }],
    ui: [{ value: "Button.tsx" }, { value: "Modal.tsx" }],
    docs: [{ value: "getting-started.md" }, { value: "api.md" }],
};

const STRESS_FILES: TreeNode<string>[] = Array.from({ length: STRESS_BRANCH_COUNT }, (_unused, branchIndex) => ({
    value: `package-${branchIndex + 1}`,
    children: Array.from({ length: STRESS_LEAF_COUNT }, (_leafUnused, leafIndex) => ({
        value: `package-${branchIndex + 1}/file-${leafIndex + 1}.ts`,
    })),
}));

const RANKS: TreeNode<string>[] = [
    {
        value: "Animalia",
        children: [
            { value: "Chordata", children: [{ value: "Mammalia" }, { value: "Aves" }, { value: "Reptilia" }] },
            { value: "Arthropoda", children: [{ value: "Insecta" }, { value: "Arachnida" }] },
            { value: "Mollusca", children: [{ value: "Gastropoda" }, { value: "Bivalvia" }] },
            { value: "Annelida", children: [{ value: "Clitellata" }] },
        ],
    },
];

const RANK_ROOTS = ["Animalia", "Chordata", "Arthropoda", "Mollusca", "Annelida"];

const RADIAL_ITEM = 88;
const RADIAL_RING_GAP = 96;
const RADIAL_WIDTH = 600;

const RADIAL_LAYOUT: PlacementLayoutFn = ({ itemCount, itemParents = [] }: PlacementLayoutDefs) => {
    const byParent = new Map<number | undefined, number[]>();

    for (let index = 0; index < itemCount; index++) {
        const siblings = byParent.get(itemParents[index]) ?? [];

        siblings.push(index);
        byParent.set(itemParents[index], siblings);
    }

    const spans = Array.from({ length: itemCount }, () => ({ from: 0, to: 0, depth: 0 }));

    const assign = (parent: number | undefined, from: number, to: number, depth: number) => {
        const siblings = byParent.get(parent) ?? [];
        const step = (to - from) / Math.max(siblings.length, 1);

        siblings.forEach((child, order) => {
            spans[child] = { from: from + step * order, to: from + step * (order + 1), depth };
            assign(child, from + step * order, from + step * (order + 1), depth + 1);
        });
    };

    assign(undefined, -90, 270, 0);

    const placements = spans.map<PlacementRect>((span) => {
        const radians = ((span.from + span.to) * 0.5 * Math.PI) / 180;
        const radius = span.depth === 0 ? 0 : RADIAL_ITEM + RADIAL_RING_GAP * span.depth;

        return {
            leftShare: 0.5 + (Math.cos(radians) * radius) / RADIAL_WIDTH,
            topShare: 0.5 + (Math.sin(radians) * radius) / RADIAL_WIDTH,
            widthShare: RADIAL_ITEM / RADIAL_WIDTH,
            heightShare: RADIAL_ITEM / RADIAL_WIDTH,
        };
    });

    return { placements, heightRatio: 1, pickRule: "nearest", origin: { x: 0.5, y: 0.5 } };
};

const LinkComponent = (props: TreeLinkProps) => <a {...props} data-link-component />;

const fillBranch = (nodes: TreeNode<string>[], value: string): TreeNode<string>[] =>
    nodes.map((node) => {
        if (node.value === value) return { ...node, children: REMOTE_CHILDREN[value] ?? [], hasMoreChildren: false };

        if (!node.children) return node;

        return { ...node, children: fillBranch(node.children, value) };
    });

type FilesProps = Partial<TreeProps<string>> & {
    scope: string;
    initialExpanded?: string[];
    isHeld?: boolean;
    hasOutsideCollapse?: boolean;
    width?: number;
};

const Files = ({
    scope,
    initialExpanded = [],
    isHeld = true,
    hasOutsideCollapse = false,
    width = 360,
    ...rest
}: FilesProps) => {
    const valueState = useState<string | undefined>();
    const ownExpandedState = useState<string[]>(initialExpanded);
    const expandedState = rest.expandedState ?? ownExpandedState;
    const [expanded] = expandedState;
    const setOwnExpanded = ownExpandedState[1];

    return (
        <div data-testid={scope} style={{ width }}>
            <Tree<string>
                nodes={FILES}
                ariaLabel={"Repository"}
                renderNode={(node, renderProps) => (
                    <div style={{ display: "flex", gap: 6, paddingInlineStart: renderProps.depth * INDENT_PX }}>
                        <span aria-hidden="true">{renderProps.isBranch ? "▶" : "•"}</span>
                        <span>{String(node.value)}</span>
                    </div>
                )}
                {...rest}
                valueState={isHeld ? valueState : undefined}
                expandedState={isHeld ? expandedState : undefined}
            />

            {hasOutsideCollapse && (
                <button
                    type="button"
                    onClick={() =>
                        setTimeout(
                            () => setOwnExpanded((previous) => previous.filter((value) => value !== "Lib")),
                            OUTSIDE_COLLAPSE_DELAY_MS,
                        )
                    }
                >
                    Collapse Lib later
                </button>
            )}

            <output data-readout="tree">{`value: ${valueState[0] ?? "undefined"} | expanded: ${JSON.stringify(expanded)}`}</output>
        </div>
    );
};

const Lazy = () => {
    const [nodes, setNodes] = useState(REMOTE_ROOT);
    const expandedState = useState<string[]>([]);
    const askedRef = useRef(new Set<string>());
    const expanded = expandedState[0];

    useEffect(() => {
        const timers = expanded
            .filter((value) => !askedRef.current.has(value))
            .map((value) => {
                askedRef.current.add(value);

                return setTimeout(() => setNodes((previous) => fillBranch(previous, value)), REMOTE_LOAD_DELAY_MS);
            });

        return () => {
            for (const timer of timers) clearTimeout(timer);
        };
    }, [expanded]);

    return (
        <Files
            scope="lazy"
            nodes={nodes}
            ariaLabel={"Remote repository"}
            expandedState={expandedState}
            renderPendingChildren={(_node, depth) => (
                <div style={{ paddingInlineStart: depth * INDENT_PX }}>Fetching…</div>
            )}
        />
    );
};

export const Default = () => (
    <>
        <Files scope="default" initialExpanded={["src"]} />
        <Files scope="collapsed" />
        <Files scope="unheld" isHeld={false} />
        <Files scope="disabled" nodes={FILES_WITH_DISABLED} initialExpanded={["src", "Lib"]} />
        <Files scope="reachable" nodes={FILES_WITH_REACHABLE} initialExpanded={["src"]} />
        <Files
            scope="outside"
            initialExpanded={["src", "Lib"]}
            ariaLabel={"Repository, collapsed from outside"}
            hasOutsideCollapse={true}
        />
        <Files scope="links" nodes={DOCS} initialExpanded={["Guides"]} ariaLabel={"Docs"} />
        <Files
            scope="linkComponent"
            nodes={DOCS}
            initialExpanded={["Guides"]}
            ariaLabel={"Routed docs"}
            linkComponent={LinkComponent}
        />
    </>
);

export const LazyBranches = () => <Lazy />;

export const RightToLeft = () => (
    <div dir="rtl">
        <Files scope="rightToLeft" />
    </div>
);

export const Virtualized = () => (
    <div style={{ overflowY: "auto", maxHeight: 320, width: 360 }}>
        <Files
            scope="virtualized"
            nodes={STRESS_FILES}
            initialExpanded={["package-1", "package-2", "package-3"]}
            ariaLabel={"Generated repository"}
            computeEstimatedNodeHeight={() => STRESS_NODE_HEIGHT}
        />
    </div>
);

export const Radial = () => (
    <div style={{ width: RADIAL_WIDTH }}>
        <Files
            scope="radial"
            width={RADIAL_WIDTH}
            nodes={RANKS}
            initialExpanded={RANK_ROOTS}
            ariaLabel={"Ranks"}
            computeLayout={RADIAL_LAYOUT}
            renderNode={(node) => <span>{String(node.value)}</span>}
        />
    </div>
);

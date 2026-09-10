import { For, createMemo } from "solid-js";

import { Tree, access } from "@thewaver/ss-components";
import type { PlacementLayoutDefs, PlacementLayoutFn, PlacementRect, TreeNode } from "@thewaver/ss-components";

import { PageTreeRadialNode } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { RANKS } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

import * as styles from "../TreePage.css";

/**
 * A radial tree is the one arrangement the shared layouts cannot supply, because it needs more than an item
 * count: every node has to know its parent before it can be given a slice of the turn. It lives here as a
 * worked example of writing a layout of your own — a layout is only a function from a set of defs to a list
 * of boxes in fractions of the arrangement's own width.
 */
const RADIAL_DEFS = { innerRadius: 88, ringGap: 96, itemWidth: 88, itemHeight: 88, spreadDegrees: 360 };

const CENTRE = 0.5;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const UPWARD_DEGREES = -90;
const CENTRED_ROOT_COUNT = 1;

type RadialSpan = { from: number; to: number; depth: number };

/** Gives every node the slice of its parent's turn that its siblings leave it, depth by depth. */
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
        depth === 0 && rootCount === CENTRED_ROOT_COUNT ? 0 : RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth;
    const deepest = spans.reduce((lowest, span) => Math.max(lowest, span.depth), 0);
    const width = (radiusAt(deepest) + RADIAL_DEFS.itemWidth * CENTRE) * 2;

    const placements = spans.map<PlacementRect>((span) => {
        const radians = ((span.from + span.to) * CENTRE) / DEGREES_PER_RADIAN;
        const radius = radiusAt(span.depth);

        return {
            left: CENTRE + (Math.cos(radians) * radius) / width,
            top: CENTRE + (Math.sin(radians) * radius) / width,
            width: RADIAL_DEFS.itemWidth / width,
            height: RADIAL_DEFS.itemHeight / width,
        };
    });

    return { placements, heightRatio: 1, pickRule: "nearest", origin: { x: CENTRE, y: CENTRE } };
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

export const RadialExample = (props: Props) => {
    const getRankRadii = createMemo(() =>
        [...toShownDepths(RANKS, access(props.expandedSignal[0]), ROOT_DEPTH, new Set())]
            .filter((depth) => depth > ROOT_DEPTH)
            .map((depth) => RADIAL_DEFS.innerRadius + RADIAL_DEFS.ringGap * depth),
    );

    const getStageWidth = () => `${(Math.max(...getRankRadii(), ROOT_DEPTH) + RADIAL_DEFS.itemWidth / 2) * 2}px`;

    return (
        <div class={styles.rankStage}>
            <For each={getRankRadii()}>
                {(radius) => (
                    <div
                        class={styles.rankRing}
                        style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
                        aria-hidden={"true"}
                    />
                )}
            </For>

            <div style={{ width: getStageWidth() }}>
                <Tree
                    nodes={() => RANKS}
                    valueSignal={props.valueSignal}
                    expandedSignal={props.expandedSignal}
                    ariaLabel={"Ranks"}
                    computeLayout={RADIAL_LAYOUT}
                    renderNode={(getNode, getRenderProps) => (
                        <PageTreeRadialNode renderProps={getRenderProps}>{getNode().value}</PageTreeRadialNode>
                    )}
                />
            </div>
        </div>
    );
};

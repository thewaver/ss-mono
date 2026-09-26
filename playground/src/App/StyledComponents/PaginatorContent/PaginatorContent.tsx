import { For, type ParentProps, Show, createUniqueId } from "solid-js";

import type { PaginatorStep, PlacementRect } from "@thewaver/ss-components";
import { PlacementUtils, access } from "@thewaver/ss-components";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    PaginatorDialGapContentProps,
    PaginatorGapContentProps,
    PaginatorPageContentProps,
    PaginatorPanelProps,
    PaginatorStepContentProps,
    PaginatorWedgeProps,
} from "./PaginatorContent.types";

import * as styles from "./PaginatorContent.css";

const HALF = 0.5;
const GAP_MARK = "…";
const PAGE_SIZE = 3;
const FIRST_PAGE = 1;

const RESULTS = [
    "Aurora",
    "Basalt",
    "Cinder",
    "Drift",
    "Ember",
    "Fathom",
    "Glimmer",
    "Hollow",
    "Iris",
    "Jetty",
    "Kelp",
    "Loam",
];

const toResult = (index: number) => RESULTS[index % RESULTS.length];

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

const STEP_GLYPHS: Record<PaginatorStep, string> = {
    first: "«",
    previous: "‹",
    next: "›",
    last: "»",
};

export const PagePaginatorPage = (props: PaginatorPageContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.paginatorPage}
            classList={{
                [getLayerClass()]: true,
                [styles.isCurrent]: access(props.renderProps).isCurrent,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isActive]: access(props.renderProps).isActive,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            aria-hidden="true"
        >
            {access(props.renderProps).page}
        </div>
    );
};

export const PagePaginatorStep = (props: PaginatorStepContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={styles.paginatorStep}
            classList={{
                [getLayerClass()]: true,
                [styles.isHovered]: access(props.renderProps).isHovered,
                [styles.isActive]: access(props.renderProps).isActive,
                [styles.isDisabled]: access(props.renderProps).isDisabled,
            }}
            aria-hidden="true"
        >
            {STEP_GLYPHS[access(props.renderProps).step]}
        </div>
    );
};

export const PagePaginatorGap = (props: PaginatorGapContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div
            class={[styles.paginatorGap, getLayerClass()].join(" ")}
            title={`Pages ${access(props.entry).from} to ${access(props.entry).to}`}
        >
            …
        </div>
    );
};

export const PagePaginatorWedge = (props: PaginatorWedgeProps) => {
    const getLayerClass = useLayerClass();

    const gradientId = createUniqueId();

    const getSectorPath = () => PlacementUtils.getSectorPath(access(props.placement).sector!);

    return (
        <div
            class={styles.paginatorWedge}
            classList={{
                [getLayerClass()]: true,
                [styles.isCurrent]: access(props.isCurrent),
                [styles.isHovered]: access(props.isHovered),
                [styles.isActive]: access(props.isActive),
                [styles.isDisabled]: access(props.isDisabled),
            }}
        >
            <svg class={styles.paginatorWedgeCanvas} viewBox={toViewBox(access(props.placement))} aria-hidden="true">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
                        <stop class={styles.paginatorWedgeGradientFrom} offset="0%" />
                        <stop class={styles.paginatorWedgeGradientTo} offset="100%" />
                    </linearGradient>
                </defs>

                <path class={styles.paginatorWedgeShape} d={getSectorPath()} />

                <path class={styles.paginatorWedgeFill} style={{ fill: `url(#${gradientId})` }} d={getSectorPath()} />
            </svg>

            <div class={styles.paginatorWedgeLabel} aria-hidden="true">
                {props.children}
            </div>
        </div>
    );
};

export const PagePaginatorDialPage = (props: PaginatorPageContentProps) => {
    return (
        <Show when={access(props.renderProps).placement}>
            {(getPlacement) => (
                <PagePaginatorWedge
                    placement={getPlacement}
                    isCurrent={() => access(props.renderProps).isCurrent}
                    isHovered={() => access(props.renderProps).isHovered ?? false}
                    isActive={() => access(props.renderProps).isActive ?? false}
                    isDisabled={() => access(props.renderProps).isDisabled ?? false}
                >
                    {access(props.renderProps).page}
                </PagePaginatorWedge>
            )}
        </Show>
    );
};

export const PagePaginatorDialStep = (props: PaginatorStepContentProps) => {
    return (
        <Show when={access(props.renderProps).placement}>
            {(getPlacement) => (
                <PagePaginatorWedge
                    placement={getPlacement}
                    isHovered={() => access(props.renderProps).isHovered ?? false}
                    isActive={() => access(props.renderProps).isActive ?? false}
                    isDisabled={() => access(props.renderProps).isDisabled ?? false}
                >
                    {STEP_GLYPHS[access(props.renderProps).step]}
                </PagePaginatorWedge>
            )}
        </Show>
    );
};

export const PagePaginatorDialGap = (props: PaginatorDialGapContentProps) => {
    return (
        <Show when={access(props.placement)}>
            {(getPlacement) => (
                <PagePaginatorWedge placement={getPlacement} isDisabled={() => true}>
                    <span title={`Pages ${access(props.entry).from} to ${access(props.entry).to}`}>{GAP_MARK}</span>
                </PagePaginatorWedge>
            )}
        </Show>
    );
};

export const PagePaginatorPanel = (props: PaginatorPanelProps) => {
    const getLayerClass = useLayerClass();

    const getFirstIndex = () => (Math.max(access(props.page), FIRST_PAGE) - FIRST_PAGE) * PAGE_SIZE;

    const getTotal = () => Math.max(access(props.pageCount), 0) * PAGE_SIZE;

    const getIndexes = () =>
        Array.from({ length: PAGE_SIZE }, (_unused, offset) => getFirstIndex() + offset).filter(
            (index) => index < getTotal(),
        );

    return (
        <div class={[styles.paginatorPanel, getLayerClass()].join(" ")}>
            <div class={styles.paginatorPanelSummary} role="status">
                {getIndexes().length === 0
                    ? "nothing to show"
                    : `showing ${getFirstIndex() + FIRST_PAGE} to ${getFirstIndex() + getIndexes().length} of ${getTotal()}`}
            </div>

            <For each={getIndexes()}>
                {(index) => (
                    <div class={styles.paginatorPanelRow}>
                        <span>{toResult(index)}</span>

                        <span class={styles.paginatorPanelIndex}>{`#${index + FIRST_PAGE}`}</span>
                    </div>
                )}
            </For>
        </div>
    );
};

export const PagePaginatorDemo = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.paginatorDemo, getLayerClass()].join(" ")}>{props.children}</div>;
};

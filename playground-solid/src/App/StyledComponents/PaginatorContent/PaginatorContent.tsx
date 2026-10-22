import { For, type ParentProps, Show, createUniqueId } from "solid-js";

import type { PlacementRect } from "@thewaver/ss-components-solid";
import { PaginatorUtils, PlacementUtils, access } from "@thewaver/ss-components-solid";
import {
    GAP_MARK,
    HALF,
    RESULTS,
    STEP_GLYPHS,
} from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    PaginatorCountContentProps,
    PaginatorDialGapContentProps,
    PaginatorGapContentProps,
    PaginatorPageContentProps,
    PaginatorPanelProps,
    PaginatorStepContentProps,
    PaginatorWedgeProps,
} from "./PaginatorContentSolid.types";

const toResult = (itemNumber: number) => RESULTS[(itemNumber - 1) % RESULTS.length];

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

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
                <PagePaginatorWedge placement={getPlacement} isDisabled={true}>
                    <span title={`Pages ${access(props.entry).from} to ${access(props.entry).to}`}>{GAP_MARK}</span>
                </PagePaginatorWedge>
            )}
        </Show>
    );
};

export const PagePaginatorPanel = (props: PaginatorPanelProps) => {
    const getLayerClass = useLayerClass();

    const getRange = () =>
        PaginatorUtils.computeItemRange(access(props.page), access(props.itemCount), access(props.pageSize));

    const getSummary = () => {
        const range = getRange();

        return range === undefined
            ? "nothing to show"
            : `showing ${range.first} to ${range.last} of ${access(props.itemCount)}`;
    };

    const getItemNumbers = () => {
        const range = getRange();

        return range === undefined
            ? []
            : Array.from({ length: range.last - range.first + 1 }, (_unused, offset) => range.first + offset);
    };

    return (
        <div class={[styles.paginatorPanel, getLayerClass()].join(" ")}>
            <div class={styles.paginatorPanelSummary} role="status">
                {getSummary()}
            </div>

            <For each={getItemNumbers()}>
                {(itemNumber) => (
                    <div class={styles.paginatorPanelRow}>
                        <span>{toResult(itemNumber)}</span>

                        <span class={styles.paginatorPanelIndex}>{`#${itemNumber}`}</span>
                    </div>
                )}
            </For>
        </div>
    );
};

export const PagePaginatorCount = (props: PaginatorCountContentProps) => {
    const getLayerClass = useLayerClass();

    return (
        <div class={[styles.paginatorCount, getLayerClass()].join(" ")}>
            {`${access(props.page)} of ${access(props.pageCount)}`}
        </div>
    );
};

export const PagePaginatorDemo = (props: ParentProps) => {
    const getLayerClass = useLayerClass();

    return <div class={[styles.paginatorDemo, getLayerClass()].join(" ")}>{props.children}</div>;
};

import type { PropsWithChildren } from "react";
import { useId } from "react";

import type { PaginatorStep, PlacementRect } from "@thewaver/ss-components-react";
import { PlacementUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type {
    PaginatorDialGapContentProps,
    PaginatorGapContentProps,
    PaginatorPageContentProps,
    PaginatorPanelProps,
    PaginatorStepContentProps,
    PaginatorWedgeProps,
} from "./PaginatorContent.types";

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
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.paginatorPage,
                layerClass,
                props.renderProps.isCurrent && styles.isCurrent,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isActive && styles.isActive,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {props.renderProps.page}
        </div>
    );
};

export const PagePaginatorStep = (props: PaginatorStepContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[
                styles.paginatorStep,
                layerClass,
                props.renderProps.isHovered && styles.isHovered,
                props.renderProps.isActive && styles.isActive,
                props.renderProps.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
            aria-hidden="true"
        >
            {STEP_GLYPHS[props.renderProps.step]}
        </div>
    );
};

export const PagePaginatorGap = (props: PaginatorGapContentProps) => {
    const layerClass = useLayerClass();

    return (
        <div
            className={[styles.paginatorGap, layerClass].join(" ")}
            title={`Pages ${props.entry.from} to ${props.entry.to}`}
        >
            …
        </div>
    );
};

export const PagePaginatorWedge = (props: PaginatorWedgeProps) => {
    const layerClass = useLayerClass();

    const gradientId = useId();

    const sectorPath = PlacementUtils.getSectorPath(props.placement.sector!);

    return (
        <div
            className={[
                styles.paginatorWedge,
                layerClass,
                props.isCurrent && styles.isCurrent,
                props.isHovered && styles.isHovered,
                props.isActive && styles.isActive,
                props.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <svg className={styles.paginatorWedgeCanvas} viewBox={toViewBox(props.placement)} aria-hidden="true">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
                        <stop className={styles.paginatorWedgeGradientFrom} offset="0%" />
                        <stop className={styles.paginatorWedgeGradientTo} offset="100%" />
                    </linearGradient>
                </defs>

                <path className={styles.paginatorWedgeShape} d={sectorPath} />

                <path className={styles.paginatorWedgeFill} style={{ fill: `url(#${gradientId})` }} d={sectorPath} />
            </svg>

            <div className={styles.paginatorWedgeLabel} aria-hidden="true">
                {props.children}
            </div>
        </div>
    );
};

export const PagePaginatorDialPage = (props: PaginatorPageContentProps) => {
    return props.renderProps.placement ? (
        <PagePaginatorWedge
            placement={props.renderProps.placement}
            isCurrent={props.renderProps.isCurrent}
            isHovered={props.renderProps.isHovered ?? false}
            isActive={props.renderProps.isActive ?? false}
            isDisabled={props.renderProps.isDisabled ?? false}
        >
            {props.renderProps.page}
        </PagePaginatorWedge>
    ) : null;
};

export const PagePaginatorDialStep = (props: PaginatorStepContentProps) => {
    return props.renderProps.placement ? (
        <PagePaginatorWedge
            placement={props.renderProps.placement}
            isHovered={props.renderProps.isHovered ?? false}
            isActive={props.renderProps.isActive ?? false}
            isDisabled={props.renderProps.isDisabled ?? false}
        >
            {STEP_GLYPHS[props.renderProps.step]}
        </PagePaginatorWedge>
    ) : null;
};

export const PagePaginatorDialGap = (props: PaginatorDialGapContentProps) => {
    return props.placement ? (
        <PagePaginatorWedge placement={props.placement} isDisabled={true}>
            <span title={`Pages ${props.entry.from} to ${props.entry.to}`}>{GAP_MARK}</span>
        </PagePaginatorWedge>
    ) : null;
};

export const PagePaginatorPanel = (props: PaginatorPanelProps) => {
    const layerClass = useLayerClass();

    const firstIndex = (Math.max(props.page, FIRST_PAGE) - FIRST_PAGE) * PAGE_SIZE;

    const total = Math.max(props.pageCount, 0) * PAGE_SIZE;

    const indexes = Array.from({ length: PAGE_SIZE }, (_unused, offset) => firstIndex + offset).filter(
        (index) => index < total,
    );

    return (
        <div className={[styles.paginatorPanel, layerClass].join(" ")}>
            <div className={styles.paginatorPanelSummary} role="status">
                {indexes.length === 0
                    ? "nothing to show"
                    : `showing ${firstIndex + FIRST_PAGE} to ${firstIndex + indexes.length} of ${total}`}
            </div>

            {indexes.map((index) => (
                <div key={index} className={styles.paginatorPanelRow}>
                    <span>{toResult(index)}</span>

                    <span className={styles.paginatorPanelIndex}>{`#${index + FIRST_PAGE}`}</span>
                </div>
            ))}
        </div>
    );
};

export const PagePaginatorDemo = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.paginatorDemo, layerClass].join(" ")}>{props.children}</div>;
};

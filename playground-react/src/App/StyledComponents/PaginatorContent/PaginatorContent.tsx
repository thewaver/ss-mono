import type { PropsWithChildren } from "react";
import { useId } from "react";

import type { PlacementRect } from "@thewaver/ss-components-react";
import { PaginatorUtils, PlacementUtils } from "@thewaver/ss-components-react";
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
} from "./PaginatorContentReact.types";

const toResult = (itemNumber: number) => RESULTS[(itemNumber - 1) % RESULTS.length];

const toViewBox = (rect: PlacementRect) =>
    `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

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

    const range = PaginatorUtils.computeItemRange(props.page, props.itemCount, props.pageSize);

    const summary =
        range === undefined ? "nothing to show" : `showing ${range.first} to ${range.last} of ${props.itemCount}`;

    const itemNumbers =
        range === undefined
            ? []
            : Array.from({ length: range.last - range.first + 1 }, (_unused, offset) => range.first + offset);

    return (
        <div className={[styles.paginatorPanel, layerClass].join(" ")}>
            <div className={styles.paginatorPanelSummary} role="status">
                {summary}
            </div>

            {itemNumbers.map((itemNumber) => (
                <div key={itemNumber} className={styles.paginatorPanelRow}>
                    <span>{toResult(itemNumber)}</span>

                    <span className={styles.paginatorPanelIndex}>{`#${itemNumber}`}</span>
                </div>
            ))}
        </div>
    );
};

export const PagePaginatorCount = (props: PaginatorCountContentProps) => {
    const layerClass = useLayerClass();

    return <div className={[styles.paginatorCount, layerClass].join(" ")}>{`${props.page} of ${props.pageCount}`}</div>;
};

export const PagePaginatorDemo = (props: PropsWithChildren) => {
    const layerClass = useLayerClass();

    return <div className={[styles.paginatorDemo, layerClass].join(" ")}>{props.children}</div>;
};

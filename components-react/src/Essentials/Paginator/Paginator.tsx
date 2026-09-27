import { Fragment, type MouseEvent, type ReactNode, useMemo } from "react";

import {
    type InteractionSizing,
    PAGINATOR_DEFAULTS,
    type PaginatorGapEntry,
    type PaginatorPageEntry,
    type PaginatorPageRenderProps,
    type PaginatorStep,
    type PaginatorStepRenderProps,
    PaginatorStyles,
    PaginatorUtils,
} from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import type { PaginatorItemProps, PaginatorProps } from "./Paginator.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

const PaginatorItem = <TExtra extends object>(props: PaginatorItemProps<TExtra>) => {
    const isDisabled = props.flags.isDisabled ?? false;

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        props.onActivate();
    };

    const commonProps = {
        "className": PaginatorStyles.paginatorItem,
        "id": props.id,
        "aria-label": props.ariaLabel,
        "aria-disabled": isDisabled || undefined,
        "aria-current": props.isCurrent ? ("page" as const) : undefined,
    };

    if (props.href === undefined) {
        return (
            <button type="button" ref={props.ref} {...commonProps} onClick={handleClick}>
                {props.renderContent(props.flags)}
            </button>
        );
    }

    const Link = props.linkComponent ?? "a";

    return (
        <Link ref={props.ref} href={props.href} {...commonProps} onClick={handleClick}>
            {props.renderContent(props.flags)}
        </Link>
    );
};

export const Paginator = (props: PaginatorProps) => {
    const pageCount = PaginatorUtils.computePageCount(props.pageCount);
    const isDisabled = props.isDisabled ?? false;
    const page = props.page;

    const entries = PaginatorUtils.getEntries(page, {
        pageCount,
        siblingCount: props.siblingCount ?? PAGINATOR_DEFAULTS.siblingCount,
        boundaryCount: props.boundaryCount ?? PAGINATOR_DEFAULTS.boundaryCount,
    });

    const { leading, trailing } = PaginatorUtils.splitSteps(props.steps ?? PAGINATOR_DEFAULTS.steps);

    const itemCount = leading.length + entries.length + trailing.length;
    const computeLayout = props.computeLayout;
    const layout = useMemo(() => computeLayout?.({ itemCount }), [computeLayout, itemCount]);

    const goTo = (target: number) => {
        if (target === page) return;

        props.onPageChange?.(target);
    };

    const renderPlaced = (index: number, element: ReactNode) => {
        const placement = layout?.placements[index];

        return placement ? (
            <PlacementItem key={index} placement={placement} stackAt={index + 1}>
                {element}
            </PlacementItem>
        ) : (
            <Fragment key={index}>{element}</Fragment>
        );
    };

    const renderStepControl = (step: PaginatorStep, index: number) => {
        const placement = layout?.placements[index];
        const { targetPage, isDisabled: isStepDisabled } = PaginatorUtils.computeStepState(
            step,
            page,
            pageCount,
            isDisabled,
        );

        return renderPlaced(
            index,
            <InteractionWrapper<PaginatorStepRenderProps>
                sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
                isDisabled={isStepDisabled}
                extraFlags={{ step, targetPage, placement }}
                renderControl={(setElementRef, renderProps) => (
                    <PaginatorItem
                        ref={setElementRef}
                        href={isStepDisabled ? undefined : props.computeHref?.(targetPage)}
                        isCurrent={false}
                        ariaLabel={props.computeStepLabel(step, targetPage)}
                        flags={renderProps}
                        linkComponent={props.linkComponent}
                        renderContent={() => props.renderStep(step, renderProps)}
                        onActivate={() => goTo(targetPage)}
                    />
                )}
            />,
        );
    };

    const renderPageControl = (entry: PaginatorPageEntry, index: number) => {
        const placement = layout?.placements[index];
        const isCurrent = entry.page === page;

        return renderPlaced(
            index,
            <InteractionWrapper<PaginatorPageRenderProps>
                sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
                isDisabled={isDisabled}
                extraFlags={{ page: entry.page, isCurrent, placement }}
                renderControl={(setElementRef, renderProps) => (
                    <PaginatorItem
                        ref={setElementRef}
                        href={props.computeHref?.(entry.page)}
                        isCurrent={isCurrent}
                        ariaLabel={props.computePageLabel(entry.page, pageCount)}
                        flags={renderProps}
                        linkComponent={props.linkComponent}
                        renderContent={() => props.renderPage(entry, renderProps)}
                        onActivate={() => goTo(entry.page)}
                    />
                )}
            />,
        );
    };

    const renderGapControl = (entry: PaginatorGapEntry, index: number) =>
        renderPlaced(
            index,
            <span className={PaginatorStyles.paginatorGap} aria-hidden="true">
                {props.renderGap(entry, layout?.placements[index])}
            </span>,
        );

    const row = (
        <>
            {leading.map((step, index) => renderStepControl(step, index))}

            {entries.map((entry, index) =>
                entry.kind === "page"
                    ? renderPageControl(entry, leading.length + index)
                    : renderGapControl(entry, leading.length + index),
            )}

            {trailing.map((step, index) => renderStepControl(step, leading.length + entries.length + index))}
        </>
    );

    return (
        <nav
            className={PaginatorStyles.paginatorRoot}
            style={{ gap: `${props.gap ?? PAGINATOR_DEFAULTS.gap}px` }}
            aria-label={props.ariaLabel}
        >
            {layout ? (
                <PlacementBox layout={layout} computeEffect={props.computeEffect}>
                    {row}
                </PlacementBox>
            ) : (
                row
            )}
        </nav>
    );
};

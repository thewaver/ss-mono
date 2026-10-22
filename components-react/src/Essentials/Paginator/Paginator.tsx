import { type MouseEvent, type ReactNode, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    PAGINATOR_DEFAULTS,
    type PaginatorControlEntry,
    type PaginatorGapEntry,
    type PaginatorPageEntry,
    type PaginatorPageRenderProps,
    type PaginatorStep,
    type PaginatorStepRenderProps,
    PaginatorStyles,
    PaginatorUtils,
} from "@thewaver/ss-components";
import { PlacementConst } from "@thewaver/ss-components/internal";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { PaginatorContextProvider, usePaginatorContext } from "./Paginator.context";
import type { PaginatorReactContextType } from "./Paginator.context.types";
import type {
    PaginatorItemProps,
    PaginatorPagesProps,
    PaginatorProps,
    PaginatorRootProps,
    PaginatorStepsProps,
} from "./Paginator.types";

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

const usePlacedControl = (context: PaginatorReactContextType) => {
    const elementRef = useRef<HTMLElement | null>(null);

    const [entry] = useState<PaginatorControlEntry>(() => ({
        getElementRef: () => elementRef.current ?? undefined,
    }));

    const { register, reorder } = context;

    useLayoutEffect(() => {
        const unregister = register(entry);

        reorder();

        return unregister;
    }, [register, reorder, entry]);

    const setElementRef = useCallback((element: HTMLElement | null) => {
        elementRef.current = element;
    }, []);

    const placement = context.computePlacement(entry);

    const sizing = placement === undefined ? PlacementConst.ROW_SIZING : PlacementConst.PLACED_SIZING;

    const renderPlaced = (element: ReactNode) =>
        placement ? (
            <PlacementItem placement={placement} stackAt={context.computeStackAt(entry)}>
                {element}
            </PlacementItem>
        ) : (
            element
        );

    return { setElementRef, placement, sizing, renderPlaced };
};

type PaginatorStepControlProps = Pick<PaginatorStepsProps, "computeStepLabel" | "renderStep"> & {
    context: PaginatorReactContextType;
    step: PaginatorStep;
};

type PaginatorEntryControlProps<T> = Pick<PaginatorPagesProps, "computePageLabel" | "renderPage" | "renderGap"> & {
    context: PaginatorReactContextType;
    entry: T;
};

const PaginatorStepControl = (props: PaginatorStepControlProps) => {
    const placed = usePlacedControl(props.context);

    const { targetPage, isDisabled: isStepDisabled } = PaginatorUtils.computeStepState(
        props.step,
        props.context.getPage(),
        props.context.getPageCount(),
        props.context.getIsDisabled(),
    );

    return placed.renderPlaced(
        <InteractionWrapper<PaginatorStepRenderProps>
            sizing={placed.sizing}
            isDisabled={isStepDisabled}
            extraFlags={{ step: props.step, targetPage, placement: placed.placement }}
            renderControl={(setElementRef, renderProps) => (
                <PaginatorItem
                    ref={(element) => {
                        setElementRef(element);
                        placed.setElementRef(element);
                    }}
                    href={isStepDisabled ? undefined : props.context.computeHref(targetPage)}
                    isCurrent={false}
                    ariaLabel={props.computeStepLabel(props.step, targetPage)}
                    flags={renderProps}
                    linkComponent={props.context.getLinkComponent()}
                    renderContent={() => props.renderStep(props.step, renderProps)}
                    onActivate={() => props.context.goTo(targetPage)}
                />
            )}
        />,
    );
};

const PaginatorPageControl = (props: PaginatorEntryControlProps<PaginatorPageEntry>) => {
    const placed = usePlacedControl(props.context);

    const isCurrent = props.entry.page === props.context.getPage();

    return placed.renderPlaced(
        <InteractionWrapper<PaginatorPageRenderProps>
            sizing={placed.sizing}
            isDisabled={props.context.getIsDisabled()}
            extraFlags={{ page: props.entry.page, isCurrent, placement: placed.placement }}
            renderControl={(setElementRef, renderProps) => (
                <PaginatorItem
                    ref={(element) => {
                        setElementRef(element);
                        placed.setElementRef(element);
                    }}
                    href={props.context.computeHref(props.entry.page)}
                    isCurrent={isCurrent}
                    ariaLabel={props.computePageLabel(props.entry.page, props.context.getPageCount())}
                    flags={renderProps}
                    linkComponent={props.context.getLinkComponent()}
                    renderContent={() => props.renderPage(props.entry, renderProps)}
                    onActivate={() => props.context.goTo(props.entry.page)}
                />
            )}
        />,
    );
};

const PaginatorGapControl = (props: PaginatorEntryControlProps<PaginatorGapEntry>) => {
    const placed = usePlacedControl(props.context);

    return placed.renderPlaced(
        <span ref={placed.setElementRef} className={PaginatorStyles.paginatorGap} aria-hidden="true">
            {props.renderGap(props.entry, placed.placement)}
        </span>,
    );
};

export const PaginatorRoot = (props: PaginatorRootProps) => {
    const page = props.page;
    const pageCount = PaginatorUtils.computePageCount(props.itemCount, props.pageSize ?? PAGINATOR_DEFAULTS.pageSize);
    const isDisabled = props.isDisabled ?? false;
    const linkComponent = props.linkComponent;
    const computeHref = props.computeHref;
    const computeLayout = props.computeLayout;
    const onPageChange = props.onPageChange;

    const [entries, setEntries] = useState<PaginatorControlEntry[]>([]);
    const [orderVersion, setOrderVersion] = useState(0);

    const orderedEntries = useMemo(() => PaginatorUtils.orderEntries(entries), [entries, orderVersion]);

    const layout = useMemo(() => computeLayout?.({ itemCount: entries.length }), [computeLayout, entries.length]);

    const register = useCallback((entry: PaginatorControlEntry) => {
        setEntries((prev) => [...prev, entry]);

        return () => setEntries((prev) => prev.filter((item) => item !== entry));
    }, []);

    const reorder = useCallback(() => setOrderVersion((prev) => prev + 1), []);

    const context = useMemo<PaginatorReactContextType>(
        () => ({
            getPage: () => page,
            getPageCount: () => pageCount,
            getIsDisabled: () => isDisabled,
            getLinkComponent: () => linkComponent,
            computeHref: (target) => computeHref?.(target),
            computePlacement: (entry) => PaginatorUtils.computePlacement(orderedEntries, layout, entry),
            computeStackAt: (entry) => PaginatorUtils.computeStackAt(orderedEntries, entry),
            goTo: (target) => {
                if (target === page) return;

                onPageChange?.(target);
            },
            register,
            reorder,
        }),
        [
            page,
            pageCount,
            isDisabled,
            linkComponent,
            computeHref,
            orderedEntries,
            layout,
            onPageChange,
            register,
            reorder,
        ],
    );

    const pieces = <PaginatorContextProvider value={context}>{props.children}</PaginatorContextProvider>;

    return (
        <nav aria-label={props.ariaLabel}>
            {layout ? (
                <PlacementBox layout={layout} computeEffect={props.computeEffect}>
                    {pieces}
                </PlacementBox>
            ) : (
                pieces
            )}
        </nav>
    );
};

export const PaginatorSteps = (props: PaginatorStepsProps) => {
    const context = usePaginatorContext("PaginatorSteps");

    if (!context) return null;

    const { leading, trailing } = PaginatorUtils.splitSteps(props.steps ?? PAGINATOR_DEFAULTS.steps);

    const renderStepControl = (step: PaginatorStep, index: number) => (
        <PaginatorStepControl
            key={index}
            context={context}
            step={step}
            computeStepLabel={props.computeStepLabel}
            renderStep={props.renderStep}
        />
    );

    return (
        <div className={PaginatorStyles.paginatorRow} style={{ gap: `${props.gap ?? PAGINATOR_DEFAULTS.gap}px` }}>
            {leading.map(renderStepControl)}

            {props.children}

            {trailing.map(renderStepControl)}
        </div>
    );
};

export const PaginatorPages = (props: PaginatorPagesProps) => {
    const context = usePaginatorContext("PaginatorPages");

    if (!context) return null;

    const entries = PaginatorUtils.getEntries(context.getPage(), {
        pageCount: context.getPageCount(),
        siblingCount: props.siblingCount ?? PAGINATOR_DEFAULTS.siblingCount,
        boundaryCount: props.boundaryCount ?? PAGINATOR_DEFAULTS.boundaryCount,
    });

    return (
        <div className={PaginatorStyles.paginatorRow} style={{ gap: `${props.gap ?? PAGINATOR_DEFAULTS.gap}px` }}>
            {entries.map((entry, index) =>
                entry.kind === "page" ? (
                    <PaginatorPageControl
                        key={index}
                        context={context}
                        entry={entry}
                        computePageLabel={props.computePageLabel}
                        renderPage={props.renderPage}
                        renderGap={props.renderGap}
                    />
                ) : (
                    <PaginatorGapControl
                        key={index}
                        context={context}
                        entry={entry}
                        computePageLabel={props.computePageLabel}
                        renderPage={props.renderPage}
                        renderGap={props.renderGap}
                    />
                ),
            )}
        </div>
    );
};

export const Paginator = (props: PaginatorProps) => (
    <PaginatorRoot
        itemCount={props.itemCount}
        pageSize={props.pageSize}
        page={props.page}
        isDisabled={props.isDisabled}
        ariaLabel={props.ariaLabel}
        linkComponent={props.linkComponent}
        computeHref={props.computeHref}
        computeLayout={props.computeLayout}
        computeEffect={props.computeEffect}
        onPageChange={props.onPageChange}
    >
        <PaginatorSteps
            steps={props.steps}
            gap={props.gap}
            computeStepLabel={props.computeStepLabel}
            renderStep={props.renderStep}
        >
            <PaginatorPages
                siblingCount={props.siblingCount}
                boundaryCount={props.boundaryCount}
                gap={props.gap}
                computePageLabel={props.computePageLabel}
                renderPage={props.renderPage}
                renderGap={props.renderGap}
            />
        </PaginatorSteps>
    </PaginatorRoot>
);

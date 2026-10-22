import type { Accessor, JSX, ParentProps } from "solid-js";
import { Index, Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    PAGINATOR_DEFAULTS,
    type PaginatorControlEntry,
    type PaginatorGapEntry,
    type PaginatorPageEntry,
    type PaginatorPageRenderProps,
    type PaginatorStep,
    type PaginatorStepRenderProps,
    PaginatorUtils,
    PaginatorStyles as styles,
} from "@thewaver/ss-components";
import { PlacementConst } from "@thewaver/ss-components/internal";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import { PaginatorContextProvider, usePaginatorContext } from "./Paginator.context";
import type {
    PaginatorItemProps,
    PaginatorPagesProps,
    PaginatorProps,
    PaginatorRootProps,
    PaginatorSolidContextType,
    PaginatorStepsProps,
} from "./PaginatorSolid.types";

const PaginatorItem = (props: PaginatorItemProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const handleClick = (e: MouseEvent) => {
        if (getIsDisabled()) {
            e.preventDefault();
            return;
        }

        props.onActivate();
    };

    const commonProps: Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> = {
        "class": styles.paginatorItem,
        get "id"() {
            return access(props.id);
        },
        get "aria-label"() {
            return access(props.ariaLabel);
        },
        get "aria-disabled"() {
            return getIsDisabled() || undefined;
        },
        get "aria-current"() {
            return access(props.isCurrent) ? "page" : undefined;
        },
    };

    return (
        <Show
            when={access(props.href)}
            fallback={
                <button type="button" ref={(element) => props.ref?.(element)} {...commonProps} onClick={handleClick}>
                    {props.renderContent(() => access(props.flags))}
                </button>
            }
        >
            <Dynamic
                component={props.linkComponent ?? "a"}
                ref={(element: HTMLElement) => props.ref?.(element)}
                href={access(props.href)!}
                {...commonProps}
                onClick={handleClick}
            >
                {props.renderContent(() => access(props.flags))}
            </Dynamic>
        </Show>
    );
};

const createPlacedControl = (context: PaginatorSolidContextType) => {
    const [getElementRef, setElementRef] = createSignal<HTMLElement>();

    const entry: PaginatorControlEntry = { getElementRef };

    context.register(entry);

    onMount(() => context.reorder());

    const getPlacement = createMemo(() => context.computePlacement(entry));

    const getSizing = () => (getPlacement() === undefined ? PlacementConst.ROW_SIZING : PlacementConst.PLACED_SIZING);

    const renderPlaced = (element: JSX.Element) => (
        <Show when={getPlacement()} fallback={element}>
            {(getRect) => (
                <PlacementItem placement={getRect} stackAt={() => context.computeStackAt(entry)}>
                    {element}
                </PlacementItem>
            )}
        </Show>
    );

    return { setElementRef, getPlacement, getSizing, renderPlaced };
};

type PaginatorStepControlProps = Pick<PaginatorStepsProps, "computeStepLabel" | "renderStep"> & {
    context: PaginatorSolidContextType;
    step: PaginatorStep;
};

type PaginatorEntryControlProps<T> = Pick<PaginatorPagesProps, "computePageLabel" | "renderPage" | "renderGap"> & {
    context: PaginatorSolidContextType;
    getEntry: Accessor<T>;
};

const PaginatorStepControl = (props: PaginatorStepControlProps) => {
    const placed = createPlacedControl(props.context);

    const getStepState = () =>
        PaginatorUtils.computeStepState(
            props.step,
            props.context.getPage(),
            props.context.getPageCount(),
            props.context.getIsDisabled(),
        );

    const getTargetPage = () => getStepState().targetPage;

    const getIsStepDisabled = () => getStepState().isDisabled;

    return placed.renderPlaced(
        <InteractionWrapper<PaginatorStepRenderProps>
            sizing={placed.getSizing}
            isDisabled={getIsStepDisabled}
            extraFlags={() => ({
                step: props.step,
                targetPage: getTargetPage(),
                placement: placed.getPlacement(),
            })}
            renderControl={(setElementRef, getRenderProps) => (
                <PaginatorItem
                    ref={(element) => {
                        setElementRef(element);
                        placed.setElementRef(element);
                    }}
                    href={() => (getIsStepDisabled() ? undefined : props.context.computeHref(getTargetPage()))}
                    isCurrent={false}
                    ariaLabel={() => props.computeStepLabel(props.step, getTargetPage())}
                    flags={getRenderProps}
                    linkComponent={props.context.getLinkComponent()}
                    renderContent={() => props.renderStep(() => props.step, getRenderProps)}
                    onActivate={() => props.context.goTo(getTargetPage())}
                />
            )}
        />,
    );
};

const PaginatorPageControl = (props: PaginatorEntryControlProps<PaginatorPageEntry>) => {
    const placed = createPlacedControl(props.context);

    return placed.renderPlaced(
        <InteractionWrapper<PaginatorPageRenderProps>
            sizing={placed.getSizing}
            isDisabled={props.context.getIsDisabled}
            extraFlags={() => ({
                page: props.getEntry().page,
                isCurrent: props.getEntry().page === props.context.getPage(),
                placement: placed.getPlacement(),
            })}
            renderControl={(setElementRef, getRenderProps) => (
                <PaginatorItem
                    ref={(element) => {
                        setElementRef(element);
                        placed.setElementRef(element);
                    }}
                    href={() => props.context.computeHref(props.getEntry().page)}
                    isCurrent={() => getRenderProps().isCurrent}
                    ariaLabel={() => props.computePageLabel(props.getEntry().page, props.context.getPageCount())}
                    flags={getRenderProps}
                    linkComponent={props.context.getLinkComponent()}
                    renderContent={() => props.renderPage(props.getEntry, getRenderProps)}
                    onActivate={() => props.context.goTo(props.getEntry().page)}
                />
            )}
        />,
    );
};

const PaginatorGapControl = (props: PaginatorEntryControlProps<PaginatorGapEntry>) => {
    const placed = createPlacedControl(props.context);

    return placed.renderPlaced(
        <span ref={placed.setElementRef} class={styles.paginatorGap} aria-hidden="true">
            {props.renderGap(props.getEntry, placed.getPlacement)}
        </span>,
    );
};

export const PaginatorRoot = (props: ParentProps<PaginatorRootProps>) => {
    const getPageCount = createMemo(() =>
        PaginatorUtils.computePageCount(access(props.itemCount), access(props.pageSize) ?? PAGINATOR_DEFAULTS.pageSize),
    );

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const [getEntries, setEntries] = createSignal<PaginatorControlEntry[]>([]);

    const [getOrderVersion, setOrderVersion] = createSignal(0);

    const getOrderedEntries = createMemo(() => {
        getOrderVersion();

        return PaginatorUtils.orderEntries(getEntries());
    });

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: getEntries().length }));

    const context: PaginatorSolidContextType = {
        getPage: () => access(props.page),
        getPageCount,
        getIsDisabled,
        getLinkComponent: () => props.linkComponent,
        computeHref: (page) => props.computeHref?.(page),
        computePlacement: (entry) => PaginatorUtils.computePlacement(getOrderedEntries(), getLayout(), entry),
        computeStackAt: (entry) => PaginatorUtils.computeStackAt(getOrderedEntries(), entry),
        goTo: (page) => {
            if (page === access(props.page)) return;

            void props.onPageChange?.(page);
        },
        register: (entry) => {
            setEntries((prev) => [...prev, entry]);

            onCleanup(() => {
                setEntries((prev) => prev.filter((item) => item !== entry));
            });
        },
        reorder: () => setOrderVersion((prev) => prev + 1),
    };

    const renderPieces = () => <PaginatorContextProvider value={context}>{props.children}</PaginatorContextProvider>;

    return (
        <nav aria-label={access(props.ariaLabel)}>
            <Show when={getLayout()} fallback={renderPieces()}>
                {(getResolved) => (
                    <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                        {renderPieces()}
                    </PlacementBox>
                )}
            </Show>
        </nav>
    );
};

export const PaginatorSteps = (props: ParentProps<PaginatorStepsProps>) => {
    const context = usePaginatorContext("PaginatorSteps");

    if (!context) return null;

    const getSplitSteps = createMemo(() => PaginatorUtils.splitSteps(access(props.steps) ?? PAGINATOR_DEFAULTS.steps));

    const renderStepControl = (getStep: Accessor<PaginatorStep>) => (
        <PaginatorStepControl
            context={context}
            step={getStep()}
            computeStepLabel={props.computeStepLabel}
            renderStep={props.renderStep}
        />
    );

    return (
        <div class={styles.paginatorRow} style={{ gap: `${access(props.gap) ?? PAGINATOR_DEFAULTS.gap}px` }}>
            <Index each={getSplitSteps().leading}>{renderStepControl}</Index>

            {props.children}

            <Index each={getSplitSteps().trailing}>{renderStepControl}</Index>
        </div>
    );
};

export const PaginatorPages = (props: PaginatorPagesProps) => {
    const context = usePaginatorContext("PaginatorPages");

    if (!context) return null;

    const getEntries = createMemo(() =>
        PaginatorUtils.getEntries(context.getPage(), {
            pageCount: context.getPageCount(),
            siblingCount: access(props.siblingCount) ?? PAGINATOR_DEFAULTS.siblingCount,
            boundaryCount: access(props.boundaryCount) ?? PAGINATOR_DEFAULTS.boundaryCount,
        }),
    );

    return (
        <div class={styles.paginatorRow} style={{ gap: `${access(props.gap) ?? PAGINATOR_DEFAULTS.gap}px` }}>
            <Index each={getEntries()}>
                {(getEntry) => (
                    <Show
                        when={getEntry().kind === "page" ? (getEntry() as PaginatorPageEntry) : undefined}
                        fallback={
                            <PaginatorGapControl
                                context={context}
                                getEntry={() => getEntry() as PaginatorGapEntry}
                                computePageLabel={props.computePageLabel}
                                renderPage={props.renderPage}
                                renderGap={props.renderGap}
                            />
                        }
                    >
                        {(getPageEntry) => (
                            <PaginatorPageControl
                                context={context}
                                getEntry={getPageEntry}
                                computePageLabel={props.computePageLabel}
                                renderPage={props.renderPage}
                                renderGap={props.renderGap}
                            />
                        )}
                    </Show>
                )}
            </Index>
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

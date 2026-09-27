import type { Accessor, JSX } from "solid-js";
import { Index, Show, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    type InteractionSizing,
    PAGINATOR_DEFAULTS,
    type PaginatorGapEntry,
    type PaginatorPageEntry,
    type PaginatorPageRenderProps,
    type PaginatorStep,
    type PaginatorStepRenderProps,
    PaginatorUtils,
    PaginatorStyles as styles,
} from "@thewaver/ss-components";

import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import type { PaginatorItemProps, PaginatorProps } from "./PaginatorSolid.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

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

export const Paginator = (props: PaginatorProps) => {
    const getPageCount = createMemo(() => PaginatorUtils.computePageCount(access(props.pageCount)));

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getSteps = createMemo(() => access(props.steps) ?? PAGINATOR_DEFAULTS.steps);

    const getEntries = createMemo(() =>
        PaginatorUtils.getEntries(access(props.page), {
            pageCount: getPageCount(),
            siblingCount: access(props.siblingCount) ?? PAGINATOR_DEFAULTS.siblingCount,
            boundaryCount: access(props.boundaryCount) ?? PAGINATOR_DEFAULTS.boundaryCount,
        }),
    );

    const getSplitSteps = createMemo(() => PaginatorUtils.splitSteps(getSteps()));

    const getLeadingSteps = () => getSplitSteps().leading;

    const getTrailingSteps = () => getSplitSteps().trailing;

    const getLayout = createMemo(() =>
        props.computeLayout?.({
            itemCount: getLeadingSteps().length + getEntries().length + getTrailingSteps().length,
        }),
    );

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const getSizingAt = (index: number) => (getPlacementAt(index) === undefined ? ROW_SIZING : PLACED_SIZING);

    const getEntryAt = (index: number) => getLeadingSteps().length + index;

    const getTrailingAt = (index: number) => getLeadingSteps().length + getEntries().length + index;

    const renderPlaced = (getIndex: Accessor<number>, element: JSX.Element) => {
        const getPlacement = createMemo(() => getPlacementAt(getIndex()));

        return (
            <Show when={getPlacement()} fallback={element}>
                {(getRect) => (
                    <PlacementItem placement={getRect} stackAt={() => getIndex() + 1}>
                        {element}
                    </PlacementItem>
                )}
            </Show>
        );
    };

    const goTo = (page: number) => {
        if (page === access(props.page)) return;

        void props.onPageChange?.(page);
    };

    const renderStepControl = (getStep: Accessor<PaginatorStep>, getIndex: Accessor<number>) => {
        const getStepState = () =>
            PaginatorUtils.computeStepState(getStep(), access(props.page), getPageCount(), getIsDisabled());

        const getTargetPage = () => getStepState().targetPage;

        const getIsStepDisabled = () => getStepState().isDisabled;

        return renderPlaced(
            getIndex,
            <InteractionWrapper<PaginatorStepRenderProps>
                sizing={() => getSizingAt(getIndex())}
                isDisabled={getIsStepDisabled}
                extraFlags={() => ({
                    step: getStep(),
                    targetPage: getTargetPage(),
                    placement: getPlacementAt(getIndex()),
                })}
                renderControl={(setElementRef, getRenderProps) => (
                    <PaginatorItem
                        ref={setElementRef}
                        href={() => (getIsStepDisabled() ? undefined : props.computeHref?.(getTargetPage()))}
                        isCurrent={false}
                        ariaLabel={() => props.computeStepLabel(getStep(), getTargetPage())}
                        flags={getRenderProps}
                        linkComponent={props.linkComponent}
                        renderContent={() => props.renderStep(getStep, getRenderProps)}
                        onActivate={() => goTo(getTargetPage())}
                    />
                )}
            />,
        );
    };

    const renderPageControl = (getEntry: Accessor<PaginatorPageEntry>, getIndex: Accessor<number>) =>
        renderPlaced(
            getIndex,
            <InteractionWrapper<PaginatorPageRenderProps>
                sizing={() => getSizingAt(getIndex())}
                isDisabled={getIsDisabled}
                extraFlags={() => ({
                    page: getEntry().page,
                    isCurrent: getEntry().page === access(props.page),
                    placement: getPlacementAt(getIndex()),
                })}
                renderControl={(setElementRef, getRenderProps) => (
                    <PaginatorItem
                        ref={setElementRef}
                        href={() => props.computeHref?.(getEntry().page)}
                        isCurrent={() => getRenderProps().isCurrent}
                        ariaLabel={() => props.computePageLabel(getEntry().page, getPageCount())}
                        flags={getRenderProps}
                        linkComponent={props.linkComponent}
                        renderContent={() => props.renderPage(getEntry, getRenderProps)}
                        onActivate={() => goTo(getEntry().page)}
                    />
                )}
            />,
        );

    const renderGapControl = (getEntry: Accessor<PaginatorGapEntry>, getIndex: Accessor<number>) =>
        renderPlaced(
            getIndex,
            <span class={styles.paginatorGap} aria-hidden="true">
                {props.renderGap(getEntry, () => getPlacementAt(getIndex()))}
            </span>,
        );

    const renderRow = () => (
        <>
            <Index each={getLeadingSteps()}>{(getStep, index) => renderStepControl(getStep, () => index)}</Index>

            <Index each={getEntries()}>
                {(getEntry, index) => {
                    const getIndex = () => getEntryAt(index);

                    return (
                        <Show
                            when={getEntry().kind === "page" ? (getEntry() as PaginatorPageEntry) : undefined}
                            fallback={renderGapControl(() => getEntry() as PaginatorGapEntry, getIndex)}
                        >
                            {(getPageEntry) => renderPageControl(getPageEntry, getIndex)}
                        </Show>
                    );
                }}
            </Index>

            <Index each={getTrailingSteps()}>
                {(getStep, index) => renderStepControl(getStep, () => getTrailingAt(index))}
            </Index>
        </>
    );

    return (
        <nav
            class={styles.paginatorRoot}
            style={{ gap: `${access(props.gap) ?? PAGINATOR_DEFAULTS.gap}px` }}
            aria-label={access(props.ariaLabel)}
        >
            <Show when={getLayout()} fallback={renderRow()}>
                {(getResolved) => (
                    <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                        {renderRow()}
                    </PlacementBox>
                )}
            </Show>
        </nav>
    );
};

import { type SlotsType, type VNodeChild, computed, defineComponent, h } from "vue";

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
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { PaginatorItemProps, PaginatorProps, PaginatorSlots } from "./Paginator.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

const PaginatorItem = defineComponent(
    <TExtra extends object>(
        props: PaginatorItemProps<TExtra>,
        { slots }: SlotsContext<InteractionControlSlots<TExtra>>,
    ) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            const handleClick = (e: MouseEvent) => {
                if (isDisabled) {
                    e.preventDefault();

                    return;
                }

                props.onActivate();
            };

            const commonProps = {
                "class": PaginatorStyles.paginatorItem,
                "id": props.id,
                "aria-label": props.ariaLabel,
                "aria-disabled": isDisabled || undefined,
                "aria-current": props.isCurrent ? ("page" as const) : undefined,
            };

            const content = callSlot(slots.renderContent, props.flags);

            if (props.href === undefined) {
                return (
                    <button type="button" {...commonProps} onClick={handleClick}>
                        {content}
                    </button>
                );
            }

            if (props.linkComponent === undefined) {
                return (
                    <a href={props.href} {...commonProps} onClick={handleClick}>
                        {content}
                    </a>
                );
            }

            return h(
                props.linkComponent,
                { href: props.href, ...commonProps, onClick: handleClick },
                { default: () => content },
            );
        },
    {
        name: "PaginatorItem",
        props: declareProps<PaginatorItemProps<object>>({
            id: null,
            ariaLabel: null,
            flags: null,
            href: null,
            isCurrent: Boolean,
            linkComponent: null,
            onActivate: null,
        }),
    },
);

export const Paginator = defineComponent(
    (props: PaginatorProps, { slots }: SlotsContext<PaginatorSlots>) => {
        const pageCount = computed(() => PaginatorUtils.computePageCount(props.pageCount));
        const steps = computed(() => PaginatorUtils.splitSteps(props.steps ?? PAGINATOR_DEFAULTS.steps));

        const entries = computed(() =>
            PaginatorUtils.getEntries(props.page, {
                pageCount: pageCount.value,
                siblingCount: props.siblingCount ?? PAGINATOR_DEFAULTS.siblingCount,
                boundaryCount: props.boundaryCount ?? PAGINATOR_DEFAULTS.boundaryCount,
            }),
        );

        const itemCount = computed(
            () => steps.value.leading.length + entries.value.length + steps.value.trailing.length,
        );

        const layout = computed(() => props.computeLayout?.({ itemCount: itemCount.value }));

        const goTo = (target: number) => {
            if (target === props.page) return;

            props.onPageChange?.(target);
        };

        return () => {
            const isDisabled = props.isDisabled ?? false;
            const page = props.page;
            const { leading, trailing } = steps.value;
            const currentLayout = layout.value;

            const renderPlaced = (index: number, element: VNodeChild) => {
                const placement = currentLayout?.placements[index];

                return placement ? (
                    <PlacementItem key={index} placement={placement} stackAt={index + 1}>
                        {{ default: () => element }}
                    </PlacementItem>
                ) : (
                    element
                );
            };

            const renderStepControl = (step: PaginatorStep, index: number) => {
                const placement = currentLayout?.placements[index];
                const { targetPage, isDisabled: isStepDisabled } = PaginatorUtils.computeStepState(
                    step,
                    page,
                    pageCount.value,
                    isDisabled,
                );

                return renderPlaced(
                    index,
                    <InteractionWrapper
                        key={index}
                        sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
                        isDisabled={isStepDisabled}
                        extraFlags={{ step, targetPage, placement }}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags: renderProps }) => (
                                    <PaginatorItem
                                        ref={setElementRef}
                                        href={isStepDisabled ? undefined : props.computeHref?.(targetPage)}
                                        isCurrent={false}
                                        ariaLabel={props.computeStepLabel(step, targetPage)}
                                        flags={renderProps}
                                        linkComponent={props.linkComponent}
                                        onActivate={() => goTo(targetPage)}
                                    >
                                        {
                                            {
                                                renderContent: () => callSlot(slots.renderStep, { step, renderProps }),
                                            } satisfies InteractionControlSlots<PaginatorStepRenderProps>
                                        }
                                    </PaginatorItem>
                                ),
                            } satisfies Partial<InteractionWrapperSlots<PaginatorStepRenderProps>>
                        }
                    </InteractionWrapper>,
                );
            };

            const renderPageControl = (entry: PaginatorPageEntry, index: number) => {
                const placement = currentLayout?.placements[index];
                const isCurrent = entry.page === page;

                return renderPlaced(
                    index,
                    <InteractionWrapper
                        key={index}
                        sizing={placement === undefined ? ROW_SIZING : PLACED_SIZING}
                        isDisabled={isDisabled}
                        extraFlags={{ page: entry.page, isCurrent, placement }}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags: renderProps }) => (
                                    <PaginatorItem
                                        ref={setElementRef}
                                        href={props.computeHref?.(entry.page)}
                                        isCurrent={isCurrent}
                                        ariaLabel={props.computePageLabel(entry.page, pageCount.value)}
                                        flags={renderProps}
                                        linkComponent={props.linkComponent}
                                        onActivate={() => goTo(entry.page)}
                                    >
                                        {
                                            {
                                                renderContent: () => callSlot(slots.renderPage, { entry, renderProps }),
                                            } satisfies InteractionControlSlots<PaginatorPageRenderProps>
                                        }
                                    </PaginatorItem>
                                ),
                            } satisfies Partial<InteractionWrapperSlots<PaginatorPageRenderProps>>
                        }
                    </InteractionWrapper>,
                );
            };

            const renderGapControl = (entry: PaginatorGapEntry, index: number) =>
                renderPlaced(
                    index,
                    <span key={index} class={PaginatorStyles.paginatorGap} aria-hidden="true">
                        {callSlot(slots.renderGap, { entry, placement: currentLayout?.placements[index] })}
                    </span>,
                );

            const row = [
                ...leading.map((step, index) => renderStepControl(step, index)),
                ...entries.value.map((entry, index) =>
                    entry.kind === "page"
                        ? renderPageControl(entry, leading.length + index)
                        : renderGapControl(entry, leading.length + index),
                ),
                ...trailing.map((step, index) =>
                    renderStepControl(step, leading.length + entries.value.length + index),
                ),
            ];

            return (
                <nav
                    class={PaginatorStyles.paginatorRoot}
                    style={{ gap: `${props.gap ?? PAGINATOR_DEFAULTS.gap}px` }}
                    aria-label={props.ariaLabel}
                >
                    {currentLayout ? (
                        <PlacementBox layout={currentLayout} computeEffect={props.computeEffect}>
                            {{ default: () => row }}
                        </PlacementBox>
                    ) : (
                        row
                    )}
                </nav>
            );
        };
    },
    {
        name: "Paginator",
        slots: Object as SlotsType<PaginatorSlots>,
        props: declareProps<PaginatorProps>({
            pageCount: null,
            siblingCount: null,
            boundaryCount: null,
            steps: null,
            gap: null,
            isDisabled: Boolean,
            ariaLabel: null,
            linkComponent: null,
            computeHref: null,
            computePageLabel: null,
            computeStepLabel: null,
            computeLayout: null,
            computeEffect: null,
            page: null,
            onPageChange: null,
        }),
    },
);

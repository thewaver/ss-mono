import {
    type ComponentPublicInstance,
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    h,
    onMounted,
    onScopeDispose,
    shallowRef,
} from "vue";

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
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { callSlot, declareProps } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { providePaginatorContext, usePaginatorContext } from "./Paginator.context";
import type {
    PaginatorItemProps,
    PaginatorPagesProps,
    PaginatorPagesSlots,
    PaginatorProps,
    PaginatorRootProps,
    PaginatorRootSlots,
    PaginatorSlots,
    PaginatorStepsProps,
    PaginatorStepsSlots,
    PaginatorVueContextType,
} from "./Paginator.types";

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

const usePlacedControl = (context: PaginatorVueContextType) => {
    const elementRef = shallowRef<HTMLElement>();

    const entry: PaginatorControlEntry = { getElementRef: () => elementRef.value };

    context.register(entry);

    onMounted(() => context.reorder());

    const placement = computed(() => context.computePlacement(entry));

    const stackAt = computed(() => context.computeStackAt(entry));

    const sizing = computed(() =>
        placement.value === undefined ? PlacementConst.ROW_SIZING : PlacementConst.PLACED_SIZING,
    );

    const setElementRef = (target: Element | ComponentPublicInstance | null) => {
        elementRef.value = toElement(target);
    };

    const renderPlaced = (element: VNodeChild) => {
        const rect = placement.value;

        return rect === undefined ? (
            element
        ) : (
            <PlacementItem placement={rect} stackAt={stackAt.value}>
                {{ default: () => element }}
            </PlacementItem>
        );
    };

    return { setElementRef, placement, sizing, renderPlaced };
};

type PaginatorStepControlProps = Pick<PaginatorStepsProps, "computeStepLabel"> & {
    context: PaginatorVueContextType;
    step: PaginatorStep;
};

type PaginatorEntryControlProps<T> = Pick<PaginatorPagesProps, "computePageLabel"> & {
    context: PaginatorVueContextType;
    entry: T;
};

const PaginatorStepControl = defineComponent(
    (props: PaginatorStepControlProps, { slots }: SlotsContext<Pick<PaginatorStepsSlots, "renderStep">>) => {
        const placed = usePlacedControl(props.context);

        return () => {
            const { targetPage, isDisabled: isStepDisabled } = PaginatorUtils.computeStepState(
                props.step,
                props.context.getPage(),
                props.context.getPageCount(),
                props.context.getIsDisabled(),
            );

            return placed.renderPlaced(
                <InteractionWrapper
                    sizing={placed.sizing.value}
                    isDisabled={isStepDisabled}
                    extraFlags={{ step: props.step, targetPage, placement: placed.placement.value }}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags: renderProps }) => (
                                <PaginatorItem
                                    ref={(target) => {
                                        setElementRef(target);
                                        placed.setElementRef(target);
                                    }}
                                    href={isStepDisabled ? undefined : props.context.computeHref(targetPage)}
                                    isCurrent={false}
                                    ariaLabel={props.computeStepLabel(props.step, targetPage)}
                                    flags={renderProps}
                                    linkComponent={props.context.getLinkComponent()}
                                    onActivate={() => props.context.goTo(targetPage)}
                                >
                                    {
                                        {
                                            renderContent: () =>
                                                callSlot(slots.renderStep, { step: props.step, renderProps }),
                                        } satisfies InteractionControlSlots<PaginatorStepRenderProps>
                                    }
                                </PaginatorItem>
                            ),
                        } satisfies Partial<InteractionWrapperSlots<PaginatorStepRenderProps>>
                    }
                </InteractionWrapper>,
            );
        };
    },
    {
        name: "PaginatorStepControl",
        slots: Object as SlotsType<Pick<PaginatorStepsSlots, "renderStep">>,
        props: declareProps<PaginatorStepControlProps>({
            context: null,
            step: null,
            computeStepLabel: null,
        }),
    },
);

const PaginatorPageControl = defineComponent(
    (
        props: PaginatorEntryControlProps<PaginatorPageEntry>,
        { slots }: SlotsContext<Pick<PaginatorPagesSlots, "renderPage">>,
    ) => {
        const placed = usePlacedControl(props.context);

        return () => {
            const page = props.entry.page;
            const isCurrent = page === props.context.getPage();

            return placed.renderPlaced(
                <InteractionWrapper
                    sizing={placed.sizing.value}
                    isDisabled={props.context.getIsDisabled()}
                    extraFlags={{ page, isCurrent, placement: placed.placement.value }}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags: renderProps }) => (
                                <PaginatorItem
                                    ref={(target) => {
                                        setElementRef(target);
                                        placed.setElementRef(target);
                                    }}
                                    href={props.context.computeHref(page)}
                                    isCurrent={renderProps.isCurrent}
                                    ariaLabel={props.computePageLabel(page, props.context.getPageCount())}
                                    flags={renderProps}
                                    linkComponent={props.context.getLinkComponent()}
                                    onActivate={() => props.context.goTo(page)}
                                >
                                    {
                                        {
                                            renderContent: () =>
                                                callSlot(slots.renderPage, { entry: props.entry, renderProps }),
                                        } satisfies InteractionControlSlots<PaginatorPageRenderProps>
                                    }
                                </PaginatorItem>
                            ),
                        } satisfies Partial<InteractionWrapperSlots<PaginatorPageRenderProps>>
                    }
                </InteractionWrapper>,
            );
        };
    },
    {
        name: "PaginatorPageControl",
        slots: Object as SlotsType<Pick<PaginatorPagesSlots, "renderPage">>,
        props: declareProps<PaginatorEntryControlProps<PaginatorPageEntry>>({
            context: null,
            entry: null,
            computePageLabel: null,
        }),
    },
);

const PaginatorGapControl = defineComponent(
    (
        props: PaginatorEntryControlProps<PaginatorGapEntry>,
        { slots }: SlotsContext<Pick<PaginatorPagesSlots, "renderGap">>,
    ) => {
        const placed = usePlacedControl(props.context);

        return () =>
            placed.renderPlaced(
                <span ref={placed.setElementRef} class={PaginatorStyles.paginatorGap} aria-hidden="true">
                    {callSlot(slots.renderGap, { entry: props.entry, placement: placed.placement.value })}
                </span>,
            );
    },
    {
        name: "PaginatorGapControl",
        slots: Object as SlotsType<Pick<PaginatorPagesSlots, "renderGap">>,
        props: declareProps<PaginatorEntryControlProps<PaginatorGapEntry>>({
            context: null,
            entry: null,
            computePageLabel: null,
        }),
    },
);

export const PaginatorRoot = defineComponent(
    (props: PaginatorRootProps, { slots }: SlotsContext<PaginatorRootSlots>) => {
        const pageCount = computed(() =>
            PaginatorUtils.computePageCount(props.itemCount, props.pageSize ?? PAGINATOR_DEFAULTS.pageSize),
        );

        const isDisabled = computed(() => props.isDisabled ?? false);

        const entries = shallowRef<PaginatorControlEntry[]>([]);

        const orderVersion = shallowRef(0);

        const orderedEntries = computed(() => {
            void orderVersion.value;

            return PaginatorUtils.orderEntries(entries.value);
        });

        const layout = computed(() => props.computeLayout?.({ itemCount: entries.value.length }));

        providePaginatorContext({
            getPage: () => props.page,
            getPageCount: () => pageCount.value,
            getIsDisabled: () => isDisabled.value,
            getLinkComponent: () => props.linkComponent,
            computeHref: (page) => props.computeHref?.(page),
            computePlacement: (entry) => PaginatorUtils.computePlacement(orderedEntries.value, layout.value, entry),
            computeStackAt: (entry) => PaginatorUtils.computeStackAt(orderedEntries.value, entry),
            goTo: (page) => {
                if (page === props.page) return;

                props.onPageChange?.(page);
            },
            register: (entry) => {
                entries.value = [...entries.value, entry];

                onScopeDispose(() => {
                    entries.value = entries.value.filter((item) => item !== entry);
                });
            },
            reorder: () => {
                orderVersion.value += 1;
            },
        });

        return () => {
            const currentLayout = layout.value;

            return (
                <nav aria-label={props.ariaLabel}>
                    {currentLayout ? (
                        <PlacementBox layout={currentLayout} computeEffect={props.computeEffect}>
                            {{ default: () => slots.default?.() }}
                        </PlacementBox>
                    ) : (
                        slots.default?.()
                    )}
                </nav>
            );
        };
    },
    {
        name: "PaginatorRoot",
        slots: Object as SlotsType<PaginatorRootSlots>,
        props: declareProps<PaginatorRootProps>({
            itemCount: null,
            pageSize: null,
            page: null,
            isDisabled: Boolean,
            ariaLabel: null,
            linkComponent: null,
            computeHref: null,
            computeLayout: null,
            computeEffect: null,
            onPageChange: null,
        }),
    },
);

export const PaginatorSteps = defineComponent(
    (props: PaginatorStepsProps, { slots }: SlotsContext<PaginatorStepsSlots>) => {
        const context = usePaginatorContext("PaginatorSteps");

        if (!context) return () => null;

        const splitSteps = computed(() => PaginatorUtils.splitSteps(props.steps ?? PAGINATOR_DEFAULTS.steps));

        const renderStepControl = (step: PaginatorStep, index: number) => (
            <PaginatorStepControl key={index} context={context} step={step} computeStepLabel={props.computeStepLabel}>
                {{ renderStep: slots.renderStep } satisfies Partial<PaginatorStepsSlots>}
            </PaginatorStepControl>
        );

        return () => (
            <div class={PaginatorStyles.paginatorRow} style={{ gap: `${props.gap ?? PAGINATOR_DEFAULTS.gap}px` }}>
                {splitSteps.value.leading.map(renderStepControl)}

                {slots.default?.()}

                {splitSteps.value.trailing.map(renderStepControl)}
            </div>
        );
    },
    {
        name: "PaginatorSteps",
        slots: Object as SlotsType<PaginatorStepsSlots>,
        props: declareProps<PaginatorStepsProps>({
            steps: null,
            gap: null,
            computeStepLabel: null,
        }),
    },
);

export const PaginatorPages = defineComponent(
    (props: PaginatorPagesProps, { slots }: SlotsContext<PaginatorPagesSlots>) => {
        const context = usePaginatorContext("PaginatorPages");

        if (!context) return () => null;

        const entries = computed(() =>
            PaginatorUtils.getEntries(context.getPage(), {
                pageCount: context.getPageCount(),
                siblingCount: props.siblingCount ?? PAGINATOR_DEFAULTS.siblingCount,
                boundaryCount: props.boundaryCount ?? PAGINATOR_DEFAULTS.boundaryCount,
            }),
        );

        return () => (
            <div class={PaginatorStyles.paginatorRow} style={{ gap: `${props.gap ?? PAGINATOR_DEFAULTS.gap}px` }}>
                {entries.value.map((entry, index) =>
                    entry.kind === "page" ? (
                        <PaginatorPageControl
                            key={index}
                            context={context}
                            entry={entry}
                            computePageLabel={props.computePageLabel}
                        >
                            {{ renderPage: slots.renderPage } satisfies Partial<PaginatorPagesSlots>}
                        </PaginatorPageControl>
                    ) : (
                        <PaginatorGapControl
                            key={index}
                            context={context}
                            entry={entry}
                            computePageLabel={props.computePageLabel}
                        >
                            {{ renderGap: slots.renderGap } satisfies Partial<PaginatorPagesSlots>}
                        </PaginatorGapControl>
                    ),
                )}
            </div>
        );
    },
    {
        name: "PaginatorPages",
        slots: Object as SlotsType<PaginatorPagesSlots>,
        props: declareProps<PaginatorPagesProps>({
            siblingCount: null,
            boundaryCount: null,
            gap: null,
            computePageLabel: null,
        }),
    },
);

export const Paginator = defineComponent(
    (props: PaginatorProps, { slots }: SlotsContext<PaginatorSlots>) =>
        () => (
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
                {{
                    default: () => (
                        <PaginatorSteps steps={props.steps} gap={props.gap} computeStepLabel={props.computeStepLabel}>
                            {
                                {
                                    renderStep: slots.renderStep,
                                    default: () => (
                                        <PaginatorPages
                                            siblingCount={props.siblingCount}
                                            boundaryCount={props.boundaryCount}
                                            gap={props.gap}
                                            computePageLabel={props.computePageLabel}
                                        >
                                            {
                                                {
                                                    renderPage: slots.renderPage,
                                                    renderGap: slots.renderGap,
                                                } satisfies Partial<PaginatorPagesSlots>
                                            }
                                        </PaginatorPages>
                                    ),
                                } satisfies Partial<PaginatorStepsSlots>
                            }
                        </PaginatorSteps>
                    ),
                }}
            </PaginatorRoot>
        ),
    {
        name: "Paginator",
        slots: Object as SlotsType<PaginatorSlots>,
        props: declareProps<PaginatorProps>({
            itemCount: null,
            pageSize: null,
            page: null,
            isDisabled: Boolean,
            ariaLabel: null,
            steps: null,
            gap: null,
            siblingCount: null,
            boundaryCount: null,
            linkComponent: null,
            computeHref: null,
            computeLayout: null,
            computeEffect: null,
            onPageChange: null,
            computeStepLabel: null,
            computePageLabel: null,
        }),
    },
);

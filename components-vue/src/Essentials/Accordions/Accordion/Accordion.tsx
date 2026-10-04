import { type SlotsType, computed, defineComponent, shallowRef, useId, watch } from "vue";

import {
    ACCORDION_DEFAULTS,
    type AccordionMoveDirection,
    AccordionStyles,
    AccordionUtils,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement, useStableList } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { Collapsible } from "../Collapsible/Collapsible";
import type { CollapsibleSlots } from "../Collapsible/Collapsible.types";
import type { AccordionProps, AccordionSectionProps, AccordionSlots } from "./Accordion.types";

const AccordionSection = defineComponent(
    <T,>(props: AccordionSectionProps<T>, { slots, expose }: SlotsContext<AccordionSlots<T>>) => {
        const headerId = useId();

        const headerRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => headerRef.value);

        return () => (
            <Collapsible
                ref={(target) => {
                    headerRef.value = toElement(target);
                }}
                id={headerId}
                isDisabled={props.item.isDisabled ?? false}
                isFocusableWhenDisabled={props.item.isReachableWhenDisabled ?? false}
                headingLevel={props.headingLevel}
                side={props.side}
                sizing={props.isSideways ? "fit-content" : "fill"}
                isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
                isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
                transitionDurationMs={props.transitionDurationMs}
                panelRole={"region"}
                panelAriaAttributes={{ "aria-labelledby": headerId }}
                expanded={props.isExpanded}
                onUpdate:expanded={() => props.onToggle()}
            >
                {
                    {
                        renderTrigger: (flags) => callSlot(slots.renderHeader, { item: props.item, flags }),
                        renderPanel: ({ visibilityTarget, transitionDurationMs }) => {
                            const content = callSlot(slots.renderPanel, {
                                item: props.item,
                                visibilityTarget,
                                transitionDurationMs,
                                moveDirection: props.moveDirection,
                            });

                            if (!props.isSideways) return content;

                            return (
                                <div
                                    class={AccordionStyles.accordionPanelSizer}
                                    style={{ width: AccordionUtils.toWidthStyle(props.openWidth) }}
                                >
                                    {content}
                                </div>
                            );
                        },
                    } satisfies Partial<CollapsibleSlots>
                }
            </Collapsible>
        );
    },
    {
        name: "AccordionSection",
        slots: Object as SlotsType<AccordionSlots<any>>,
        props: declareProps<AccordionSectionProps<unknown>>({
            item: null,
            headingLevel: null,
            side: null,
            isExpanded: Boolean,
            isSideways: Boolean,
            openWidth: null,
            isScrolledIntoViewOnExpand: Boolean,
            isPanelBuiltOnExpand: Boolean,
            transitionDurationMs: null,
            moveDirection: null,
            onToggle: null,
        }),
    },
);

export const Accordion = defineComponent(
    <T,>(props: AccordionProps<T>, { slots }: SlotsContext<AccordionSlots<T>>) => {
        const expanded = useTwoWay(props, "expanded", []);

        const rootRef = shallowRef<HTMLDivElement>();
        const moveDirection = shallowRef<AccordionMoveDirection>();

        const headerRefs: (HTMLElement | undefined)[] = [];
        const headerElements = shallowRef<(HTMLElement | undefined)[]>([]);

        const direction = NavigatorVueUtils.useDirection(rootRef);

        const getOrientation = () => props.orientation ?? ACCORDION_DEFAULTS.orientation;

        const getGap = () => props.gap ?? ACCORDION_DEFAULTS.gap;

        const hasRowWidths = computed(() =>
            AccordionUtils.getHasRowWidths(getOrientation(), props.sizing ?? ACCORDION_DEFAULTS.sizing),
        );

        const setHeaderRef = (index: number, element: HTMLElement | undefined) => {
            headerRefs[index] = element;

            if (headerElements.value[index] === element) return;

            const next = [...headerElements.value];

            next[index] = element;
            headerElements.value = next;
        };

        const expandedIndexes = useStableList(() =>
            props.items.reduce<number[]>((acc, item, index) => {
                if (expanded.value.includes(item.value)) acc.push(index);

                return acc;
            }, []),
        );

        const rowSize = ElementObserverVueUtils.useBorderBoxSize(rootRef, () => !hasRowWidths.value);
        const stripSizes = ElementObserverVueUtils.useBorderBoxSizes(
            () => headerElements.value.slice(0, props.items.length),
            () => !hasRowWidths.value,
        );

        const openWidths = computed<(number | undefined)[]>((previous) =>
            hasRowWidths.value
                ? AccordionUtils.computeOpenWidths(
                      props.items,
                      expandedIndexes.value,
                      {
                          rowWidth: rowSize.value.width,
                          stripWidths: stripSizes.value.map((size) => size.width),
                          gap: getGap(),
                      },
                      previous,
                  )
                : [],
        );

        watch(expandedIndexes, (next, previous) => {
            const moved = AccordionUtils.computeMoveDirection(previous, next);

            if (moved) moveDirection.value = moved;
        });

        const handleToggle = (value: T) => {
            const next = AccordionUtils.computeToggled(expanded.value, value, {
                isSingleExpand: props.isSingleExpand,
                isExpandRequired: props.isExpandRequired,
            });

            if (next !== expanded.value) expanded.value = next;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = AccordionUtils.computeFocusTarget(
                e.key,
                headerRefs,
                AccordionUtils.computeNavigableIndexes(props.items),
                document.activeElement,
                { orientation: getOrientation(), direction: direction.value },
            );

            if (target === undefined) return;

            e.preventDefault();

            headerRefs[target]?.focus();
        };

        return () => {
            const headingLevel = props.headingLevel ?? ACCORDION_DEFAULTS.headingLevel;
            const sizing = props.sizing ?? ACCORDION_DEFAULTS.sizing;
            const orientation = getOrientation();
            const side = AccordionUtils.getPanelSide(orientation);

            return (
                <div
                    ref={rootRef}
                    class={[
                        AccordionStyles.accordionRoot,
                        AccordionStyles.accordionSizingVariants[sizing],
                        AccordionStyles.accordionOrientationVariants[orientation],
                    ]}
                    style={{ gap: `${getGap()}px` }}
                    onKeydown={handleKeyDown}
                >
                    {props.items.map((item, index) => (
                        <AccordionSection
                            key={index}
                            ref={(target) => setHeaderRef(index, toElement(target))}
                            item={item}
                            headingLevel={headingLevel}
                            side={side}
                            isExpanded={expanded.value.includes(item.value)}
                            isSideways={orientation === "horizontal"}
                            openWidth={openWidths.value[index]}
                            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
                            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
                            transitionDurationMs={props.transitionDurationMs}
                            moveDirection={moveDirection.value}
                            onToggle={() => handleToggle(item.value)}
                        >
                            {{ renderHeader: slots.renderHeader, renderPanel: slots.renderPanel }}
                        </AccordionSection>
                    ))}
                </div>
            );
        };
    },
    {
        name: "Accordion",
        slots: Object as SlotsType<AccordionSlots<any>>,
        props: declareProps<AccordionProps<unknown>>({
            "gap": null,
            "sizing": null,
            "orientation": null,
            "headingLevel": null,
            "isSingleExpand": Boolean,
            "isExpandRequired": Boolean,
            "isScrolledIntoViewOnExpand": Boolean,
            "isPanelBuiltOnExpand": Boolean,
            "transitionDurationMs": null,
            "items": null,
            "expanded": null,
            "onUpdate:expanded": null,
        }),
    },
);

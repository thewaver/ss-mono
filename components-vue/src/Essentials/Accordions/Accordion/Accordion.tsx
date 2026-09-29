import { type SlotsType, defineComponent, shallowRef, useId } from "vue";

import { ACCORDION_DEFAULTS, AccordionStyles, AccordionUtils } from "@thewaver/ss-components";

import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
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
                        renderPanel: ({ visibilityTarget, transitionDurationMs }) =>
                            callSlot(slots.renderPanel, { item: props.item, visibilityTarget, transitionDurationMs }),
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
            isExpanded: Boolean,
            isScrolledIntoViewOnExpand: Boolean,
            isPanelBuiltOnExpand: Boolean,
            transitionDurationMs: null,
            onToggle: null,
        }),
    },
);

export const Accordion = defineComponent(
    <T,>(props: AccordionProps<T>, { slots }: SlotsContext<AccordionSlots<T>>) => {
        const expanded = useTwoWay(props, "expanded", []);

        const headerRefs: (HTMLElement | undefined)[] = [];

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
            );

            if (target === undefined) return;

            e.preventDefault();

            headerRefs[target]?.focus();
        };

        return () => {
            const headingLevel = props.headingLevel ?? ACCORDION_DEFAULTS.headingLevel;
            const sizing = props.sizing ?? ACCORDION_DEFAULTS.sizing;

            return (
                <div
                    class={[AccordionStyles.accordionRoot, AccordionStyles.accordionSizingVariants[sizing]]}
                    style={{ gap: `${props.gap ?? ACCORDION_DEFAULTS.gap}px` }}
                    onKeydown={handleKeyDown}
                >
                    {props.items.map((item, index) => (
                        <AccordionSection
                            key={index}
                            ref={(target) => {
                                headerRefs[index] = toElement(target);
                            }}
                            item={item}
                            headingLevel={headingLevel}
                            isExpanded={expanded.value.includes(item.value)}
                            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
                            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
                            transitionDurationMs={props.transitionDurationMs}
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

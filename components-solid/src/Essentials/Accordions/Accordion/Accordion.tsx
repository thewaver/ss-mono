import { Index, createMemo, createSignal, createUniqueId } from "solid-js";

import { ACCORDION_DEFAULTS, AccordionUtils, AccordionStyles as styles } from "@thewaver/ss-components";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import { Collapsible } from "../Collapsible/Collapsible";
import type { AccordionProps, AccordionSectionProps } from "./AccordionSolid.types";

const AccordionSection = <T,>(props: AccordionSectionProps<T>) => {
    const headerId = createUniqueId();

    const expandedSignal = SignalMirrorSolidUtils.createPassThrough(
        () => access(props.isExpanded),
        () => props.onToggle(),
    );

    return (
        <Collapsible
            ref={props.ref}
            id={() => headerId}
            isDisabled={() => access(props.item).isDisabled ?? false}
            isFocusableWhenDisabled={() => access(props.item).isReachableWhenDisabled ?? false}
            headingLevel={props.headingLevel}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
            transitionDurationMs={props.transitionDurationMs}
            panelRole={"region"}
            panelAriaAttributes={() => ({ "aria-labelledby": headerId })}
            expanded={expandedSignal}
            renderTrigger={(getFlags) => props.renderHeader(() => access(props.item), getFlags)}
            renderPanel={(getVisibilityTarget, getTransitionDurationMs) =>
                props.renderPanel(() => access(props.item), getVisibilityTarget, getTransitionDurationMs)
            }
        />
    );
};

export const Accordion = <T,>(props: AccordionProps<T>) => {
    const expandedSignal = SignalMirrorSolidUtils.createOptional<T[]>(() => props.expanded, []);

    const [getHeaderRefs, setHeaderRefs] = createSignal<(HTMLElement | undefined)[]>([]);

    const getHeadingLevel = createMemo(() => access(props.headingLevel) ?? ACCORDION_DEFAULTS.headingLevel);

    const getSizing = createMemo(() => access(props.sizing) ?? ACCORDION_DEFAULTS.sizing);

    const setHeaderRef = (index: number, element: HTMLElement) => {
        setHeaderRefs((prev) => {
            const next = [...prev];

            next[index] = element;

            return next;
        });
    };

    const getNavigableIndexes = createMemo(() => AccordionUtils.computeNavigableIndexes(access(props.items)));

    const handleToggle = (value: T) => {
        expandedSignal[1]((prev) =>
            AccordionUtils.computeToggled(prev, value, {
                isSingleExpand: access(props.isSingleExpand),
                isExpandRequired: access(props.isExpandRequired),
            }),
        );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const target = AccordionUtils.computeFocusTarget(
            e.key,
            getHeaderRefs(),
            getNavigableIndexes(),
            document.activeElement,
        );

        if (target === undefined) return;

        e.preventDefault();

        getHeaderRefs()[target]?.focus();
    };

    return (
        <div
            class={[styles.accordionRoot, styles.accordionSizingVariants[getSizing()]].join(" ")}
            style={{ gap: `${access(props.gap) ?? ACCORDION_DEFAULTS.gap}px` }}
            onKeyDown={handleKeyDown}
        >
            <Index each={access(props.items)}>
                {(getItem, index) => (
                    <AccordionSection
                        ref={(element) => setHeaderRef(index, element)}
                        item={getItem}
                        headingLevel={getHeadingLevel}
                        isExpanded={() => expandedSignal[0]().includes(getItem().value)}
                        isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
                        isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
                        transitionDurationMs={props.transitionDurationMs}
                        renderHeader={props.renderHeader}
                        renderPanel={props.renderPanel}
                        onToggle={() => handleToggle(getItem().value)}
                    />
                )}
            </Index>
        </div>
    );
};

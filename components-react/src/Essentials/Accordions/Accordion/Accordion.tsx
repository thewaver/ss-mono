import { type KeyboardEvent, useId, useRef } from "react";

import { ACCORDION_DEFAULTS, AccordionStyles, AccordionUtils } from "@thewaver/ss-components";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { Collapsible } from "../Collapsible/Collapsible";
import type { AccordionProps, AccordionSectionProps } from "./Accordion.types";

const AccordionSection = <T,>(props: AccordionSectionProps<T>) => {
    const headerId = useId();

    return (
        <Collapsible
            ref={props.ref}
            id={headerId}
            isDisabled={props.item.isDisabled ?? false}
            isFocusableWhenDisabled={props.item.isReachableWhenDisabled ?? false}
            headingLevel={props.headingLevel}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
            transitionDurationMs={props.transitionDurationMs}
            panelRole={"region"}
            panelAriaAttributes={{ "aria-labelledby": headerId }}
            expanded={[props.isExpanded, () => props.onToggle()]}
            renderTrigger={(flags) => props.renderHeader(props.item, flags)}
            renderPanel={(visibilityTarget, transitionDurationMs) =>
                props.renderPanel(props.item, visibilityTarget, transitionDurationMs)
            }
        />
    );
};

export const Accordion = <T,>(props: AccordionProps<T>) => {
    const [expanded, setExpanded] = SignalMirrorReactUtils.useOptionalState<T[]>(props.expanded, []);

    const headerRefs = useRef<(HTMLElement | null)[]>([]);

    const headingLevel = props.headingLevel ?? ACCORDION_DEFAULTS.headingLevel;
    const sizing = props.sizing ?? ACCORDION_DEFAULTS.sizing;

    const handleToggle = (value: T) => {
        const next = AccordionUtils.computeToggled(expanded, value, {
            isSingleExpand: props.isSingleExpand,
            isExpandRequired: props.isExpandRequired,
        });

        if (next !== expanded) setExpanded(next);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const target = AccordionUtils.computeFocusTarget(
            e.key,
            headerRefs.current,
            AccordionUtils.computeNavigableIndexes(props.items),
            document.activeElement,
        );

        if (target === undefined) return;

        e.preventDefault();

        headerRefs.current[target]?.focus();
    };

    return (
        <div
            className={[AccordionStyles.accordionRoot, AccordionStyles.accordionSizingVariants[sizing]].join(" ")}
            style={{ gap: `${props.gap ?? ACCORDION_DEFAULTS.gap}px` }}
            onKeyDown={handleKeyDown}
        >
            {props.items.map((item, index) => (
                <AccordionSection
                    key={index}
                    ref={(element) => {
                        headerRefs.current[index] = element;
                    }}
                    item={item}
                    headingLevel={headingLevel}
                    isExpanded={expanded.includes(item.value)}
                    isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
                    isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
                    transitionDurationMs={props.transitionDurationMs}
                    renderHeader={props.renderHeader}
                    renderPanel={props.renderPanel}
                    onToggle={() => handleToggle(item.value)}
                />
            ))}
        </div>
    );
};

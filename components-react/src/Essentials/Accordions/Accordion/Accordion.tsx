import { type KeyboardEvent, useId, useRef, useState } from "react";

import {
    ACCORDION_DEFAULTS,
    type AccordionMoveDirection,
    AccordionStyles,
    AccordionUtils,
} from "@thewaver/ss-components";

import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
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
            side={props.side}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
            transitionDurationMs={props.transitionDurationMs}
            panelRole={"region"}
            panelAriaAttributes={{ "aria-labelledby": headerId }}
            expanded={[props.isExpanded, () => props.onToggle()]}
            renderTrigger={(flags) => props.renderHeader(props.item, flags)}
            renderPanel={(visibilityTarget, transitionDurationMs) =>
                props.renderPanel(props.item, visibilityTarget, transitionDurationMs, props.moveDirection)
            }
        />
    );
};

export const Accordion = <T,>(props: AccordionProps<T>) => {
    const [expanded, setExpanded] = SignalMirrorReactUtils.useOptionalState<T[]>(props.expanded, []);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const headerRefs = useRef<(HTMLElement | null)[]>([]);

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const headingLevel = props.headingLevel ?? ACCORDION_DEFAULTS.headingLevel;
    const sizing = props.sizing ?? ACCORDION_DEFAULTS.sizing;
    const orientation = props.orientation ?? ACCORDION_DEFAULTS.orientation;
    const panelSide = AccordionUtils.getPanelSide(orientation);

    const expandedIndexes = props.items.reduce<number[]>((acc, item, index) => {
        if (expanded.includes(item.value)) acc.push(index);

        return acc;
    }, []);
    const expandedKey = expandedIndexes.join(",");

    const [move, setMove] = useState<{
        key: string;
        indexes: number[];
        direction: AccordionMoveDirection | undefined;
    }>(() => ({ key: expandedKey, indexes: expandedIndexes, direction: undefined }));

    let moveDirection = move.direction;

    if (move.key !== expandedKey) {
        moveDirection = AccordionUtils.computeMoveDirection(move.indexes, expandedIndexes) ?? move.direction;
        setMove({ key: expandedKey, indexes: expandedIndexes, direction: moveDirection });
    }

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
            { orientation, direction },
        );

        if (target === undefined) return;

        e.preventDefault();

        headerRefs.current[target]?.focus();
    };

    return (
        <div
            ref={rootRef}
            className={[
                AccordionStyles.accordionRoot,
                AccordionStyles.accordionSizingVariants[sizing],
                AccordionStyles.accordionOrientationVariants[orientation],
            ].join(" ")}
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
                    side={panelSide}
                    isExpanded={expanded.includes(item.value)}
                    isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
                    isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
                    transitionDurationMs={props.transitionDurationMs}
                    renderHeader={props.renderHeader}
                    renderPanel={props.renderPanel}
                    moveDirection={moveDirection}
                    onToggle={() => handleToggle(item.value)}
                />
            ))}
        </div>
    );
};

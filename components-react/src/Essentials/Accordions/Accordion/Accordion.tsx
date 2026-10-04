import { type KeyboardEvent, useId, useLayoutEffect, useRef, useState } from "react";

import {
    ACCORDION_DEFAULTS,
    type AccordionMoveDirection,
    AccordionStyles,
    AccordionUtils,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
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
            sizing={props.isSideways ? "fit-content" : "fill"}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
            transitionDurationMs={props.transitionDurationMs}
            panelRole={"region"}
            panelAriaAttributes={{ "aria-labelledby": headerId }}
            expanded={[props.isExpanded, () => props.onToggle()]}
            renderTrigger={(flags) => props.renderHeader(props.item, flags)}
            renderPanel={(visibilityTarget, transitionDurationMs) => {
                const content = props.renderPanel(
                    props.item,
                    visibilityTarget,
                    transitionDurationMs,
                    props.moveDirection,
                );

                if (!props.isSideways) return content;

                return (
                    <div
                        className={AccordionStyles.accordionPanelSizer}
                        style={{ width: AccordionUtils.toWidthStyle(props.openWidth) }}
                    >
                        {content}
                    </div>
                );
            }}
        />
    );
};

export const Accordion = <T,>(props: AccordionProps<T>) => {
    const [expanded, setExpanded] = SignalMirrorReactUtils.useOptionalState<T[]>(props.expanded, []);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const headerRefs = useRef<(HTMLElement | null)[]>([]);
    const headerRefSetters = useRef(new Map<number, (element: HTMLElement | null) => void>());

    const [headerElements, setHeaderElements] = useState<(HTMLElement | undefined)[]>([]);

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const headingLevel = props.headingLevel ?? ACCORDION_DEFAULTS.headingLevel;
    const sizing = props.sizing ?? ACCORDION_DEFAULTS.sizing;
    const orientation = props.orientation ?? ACCORDION_DEFAULTS.orientation;
    const panelSide = AccordionUtils.getPanelSide(orientation);
    const gap = props.gap ?? ACCORDION_DEFAULTS.gap;
    const hasRowWidths = AccordionUtils.getHasRowWidths(orientation, sizing);

    const expandedIndexes = props.items.reduce<number[]>((acc, item, index) => {
        if (expanded.includes(item.value)) acc.push(index);

        return acc;
    }, []);
    const expandedKey = expandedIndexes.join(",");

    const rowSize = ElementObserverReactUtils.useBorderBoxSize(rootRef, !hasRowWidths);
    const stripSizes = ElementObserverReactUtils.useBorderBoxSizes(
        hasRowWidths ? props.items.map((_, index) => headerElements[index]) : [],
        !hasRowWidths,
    );
    const previousWidths = useRef<(number | undefined)[]>([]);
    const openWidths = hasRowWidths
        ? AccordionUtils.computeOpenWidths(
              props.items,
              expandedIndexes,
              { rowWidth: rowSize.width, stripWidths: stripSizes.map((size) => size.width), gap },
              previousWidths.current,
          )
        : [];

    useLayoutEffect(() => {
        previousWidths.current = openWidths;
    });

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

    const getHeaderRefSetter = (index: number) => {
        const known = headerRefSetters.current.get(index);

        if (known) return known;

        const setter = (element: HTMLElement | null) => {
            headerRefs.current[index] = element;
        };

        headerRefSetters.current.set(index, setter);

        return setter;
    };

    useLayoutEffect(() => {
        const settled = props.items.map((_, index) => headerRefs.current[index] ?? undefined);

        setHeaderElements((previous) =>
            previous.length === settled.length && previous.every((element, index) => element === settled[index])
                ? previous
                : settled,
        );
    });

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
            style={{ gap: `${gap}px` }}
            onKeyDown={handleKeyDown}
        >
            {props.items.map((item, index) => (
                <AccordionSection
                    key={index}
                    ref={getHeaderRefSetter(index)}
                    item={item}
                    headingLevel={headingLevel}
                    side={panelSide}
                    isExpanded={expanded.includes(item.value)}
                    isSideways={orientation === "horizontal"}
                    openWidth={openWidths[index]}
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

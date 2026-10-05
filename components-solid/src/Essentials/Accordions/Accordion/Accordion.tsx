import { Index, createEffect, createMemo, createSignal, createUniqueId, on } from "solid-js";

import {
    ACCORDION_DEFAULTS,
    type AccordionMoveDirection,
    AccordionUtils,
    AccordionStyles as styles,
} from "@thewaver/ss-components";

import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
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
            side={props.side}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
            transitionDurationMs={props.transitionDurationMs}
            panelRole={"region"}
            panelAriaAttributes={() => ({ "aria-labelledby": headerId })}
            expanded={expandedSignal}
            renderTrigger={(getFlags) => props.renderHeader(() => access(props.item), getFlags)}
            renderPanel={(getVisibilityTarget, getTransitionDurationMs) =>
                props.renderPanel(
                    () => access(props.item),
                    getVisibilityTarget,
                    getTransitionDurationMs,
                    props.getMoveDirection,
                )
            }
        />
    );
};

export const Accordion = <T,>(props: AccordionProps<T>) => {
    const expandedSignal = SignalMirrorSolidUtils.createOptional<T[]>(() => props.expanded, []);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getHeaderRefs, setHeaderRefs] = createSignal<(HTMLElement | undefined)[]>([]);
    const [getMoveDirection, setMoveDirection] = createSignal<AccordionMoveDirection>();

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getHeadingLevel = createMemo(() => access(props.headingLevel) ?? ACCORDION_DEFAULTS.headingLevel);

    const getSizing = createMemo(() => access(props.sizing) ?? ACCORDION_DEFAULTS.sizing);

    const getOrientation = createMemo(() => access(props.orientation) ?? ACCORDION_DEFAULTS.orientation);

    const getPanelSide = createMemo(() => AccordionUtils.getPanelSide(getOrientation()));

    const getExpandedIndexes = createMemo(() => {
        const expanded = expandedSignal[0]();

        return access(props.items).reduce<number[]>((acc, item, index) => {
            if (expanded.includes(item.value)) acc.push(index);

            return acc;
        }, []);
    });

    createEffect(
        on(getExpandedIndexes, (next, previous) => {
            const direction = AccordionUtils.computeMoveDirection(previous ?? [], next);

            if (direction) setMoveDirection(direction);
        }),
    );

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
            { orientation: getOrientation(), direction: getDirection() },
        );

        if (target === undefined) return;

        e.preventDefault();

        getHeaderRefs()[target]?.focus();
    };

    return (
        <div
            ref={setRootRef}
            class={[
                styles.accordionRoot,
                styles.accordionSizingVariants[getSizing()],
                styles.accordionOrientationVariants[getOrientation()],
            ].join(" ")}
            style={{ gap: `${access(props.gap) ?? ACCORDION_DEFAULTS.gap}px` }}
            onKeyDown={handleKeyDown}
        >
            <Index each={access(props.items)}>
                {(getItem, index) => (
                    <AccordionSection
                        ref={(element) => setHeaderRef(index, element)}
                        item={getItem}
                        headingLevel={getHeadingLevel}
                        side={getPanelSide}
                        isExpanded={() => expandedSignal[0]().includes(getItem().value)}
                        isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
                        isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
                        transitionDurationMs={props.transitionDurationMs}
                        renderHeader={props.renderHeader}
                        renderPanel={props.renderPanel}
                        getMoveDirection={getMoveDirection}
                        onToggle={() => handleToggle(getItem().value)}
                    />
                )}
            </Index>
        </div>
    );
};

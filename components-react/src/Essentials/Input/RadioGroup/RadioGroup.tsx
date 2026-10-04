import { type KeyboardEvent, useCallback, useId, useMemo, useRef, useState } from "react";

import {
    FloaterStyles,
    RADIO_GROUP_DEFAULTS,
    type RadioGroupEntry,
    RadioGroupStyles,
    RadioGroupUtils,
} from "@thewaver/ss-components";

import { FloaterReactUtils } from "../../../Abstracts/Floater/FloaterReact.utils";
import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { useElement } from "../../../Utils/refUtils";
import { RadioGroupContextProvider } from "./RadioGroup.context";
import type { RadioGroupReactContextType } from "./RadioGroup.context.types";
import type { RadioGroupProps } from "./RadioGroup.types";

export const RadioGroup = <T,>(props: RadioGroupProps<T>) => {
    const rootRef = useRef<HTMLDivElement | null>(null);

    const fallbackName = useId();

    const [entries, setEntries] = useState<RadioGroupEntry[]>([]);
    const [hoveredEntry, setHoveredEntry] = useState<RadioGroupEntry>();
    const [focusedEntry, setFocusedEntry] = useState<RadioGroupEntry>();

    const [value, setValue] = props.value;
    const orientation = props.orientation ?? RADIO_GROUP_DEFAULTS.orientation;
    const transitionDurationMs = props.transitionDurationMs ?? RADIO_GROUP_DEFAULTS.transitionDurationMs;
    const name = props.name ?? fallbackName;

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const computeLayout = props.computeLayout;
    const itemCount = entries.length;
    const layout = useMemo(() => computeLayout?.({ itemCount }), [computeLayout, itemCount]);

    const orderedEntries = useMemo(() => RadioGroupUtils.orderEntries(entries), [entries]);
    const navigableEntries = RadioGroupUtils.computeNavigableEntries(orderedEntries);
    const rovingEntry = RadioGroupUtils.computeRovingEntry(navigableEntries, value);
    const selectedEntry = RadioGroupUtils.computeSelectedEntry(orderedEntries, value);

    const root = useElement(rootRef);

    const findEntry = (target: EventTarget | null) =>
        target instanceof Node
            ? orderedEntries.find((entry) => entry.getElementRef()?.parentElement?.contains(target) ?? false)
            : undefined;

    const useEntryFloater = (isEnabled: boolean, entry: RadioGroupEntry | undefined) =>
        FloaterReactUtils.useFloater({
            isEnabled,
            container: layout === undefined ? root : undefined,
            target: (entry?.getElementRef()?.offsetParent as HTMLElement | null) ?? undefined,
            layout,
            placement:
                entry === undefined ? undefined : RadioGroupUtils.computePlacement(orderedEntries, layout, entry),
            transitionDurationMs,
        });

    const selectionFloater = useEntryFloater(props.renderSelectionFloater !== undefined, selectedEntry);

    const highlightFloater = useEntryFloater(props.renderHighlightFloater !== undefined, hoveredEntry ?? focusedEntry);

    const register = useCallback((entry: RadioGroupEntry) => {
        setEntries((previous) => [...previous, entry]);

        return () => setEntries((previous) => previous.filter((item) => item !== entry));
    }, []);

    const context = useMemo(
        (): RadioGroupReactContextType => ({
            name,
            value,
            setValue: (next) => setValue(next as T),
            computeIsTabbable: (candidate) => rovingEntry?.getValue() === candidate,
            computePlacement: (entry) => RadioGroupUtils.computePlacement(orderedEntries, layout, entry),
            register,
        }),
        [name, value, setValue, rovingEntry, orderedEntries, layout, register],
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const next = RadioGroupUtils.computeKeyTarget(e.key, navigableEntries, {
            focusedElement: document.activeElement,
            rovingEntry,
            direction: layout === undefined ? direction : undefined,
        });

        if (next === undefined) return;

        e.preventDefault();

        next.getElementRef()?.focus();

        if (!next.getIsDisabled()) setValue(next.getValue() as T);
    };

    const renderFloater = (
        floater: ReturnType<typeof useEntryFloater>,
        renderContent: RadioGroupProps<T>["renderSelectionFloater"],
    ) =>
        floater.isRendered && (
            <div
                ref={floater.ref}
                className={FloaterStyles.floater}
                style={{ ...floater.bounds, transitionDuration: `${transitionDurationMs}ms` }}
            >
                {renderContent?.(floater.visibilityTarget, transitionDurationMs)}
            </div>
        );

    const content = (
        <>
            {renderFloater(highlightFloater, props.renderHighlightFloater)}
            {renderFloater(selectionFloater, props.renderSelectionFloater)}
            <RadioGroupContextProvider value={context}>{props.children}</RadioGroupContextProvider>
        </>
    );

    return (
        <div
            ref={rootRef}
            className={layout === undefined ? RadioGroupStyles.radioGroupRoot : RadioGroupStyles.radioGroupPlacedRoot}
            style={{
                flexDirection: orientation === "horizontal" ? "row" : "column",
                gap: `${props.gap ?? RADIO_GROUP_DEFAULTS.gap}px`,
            }}
            role="radiogroup"
            aria-label={props.ariaLabel}
            aria-required={props.isRequired || undefined}
            aria-invalid={props.hasError || undefined}
            onKeyDown={handleKeyDown}
            onPointerOver={(e) => setHoveredEntry(findEntry(e.target))}
            onPointerLeave={() => setHoveredEntry(undefined)}
            onFocus={(e) => setFocusedEntry(findEntry(e.target))}
            onBlur={() => setFocusedEntry(undefined)}
        >
            {layout ? (
                <PlacementBox layout={layout} computeEffect={props.computeEffect}>
                    {content}
                </PlacementBox>
            ) : (
                content
            )}
        </div>
    );
};

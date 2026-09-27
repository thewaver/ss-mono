import { type KeyboardEvent, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    RADIO_GROUP_DEFAULTS,
    type RadioGroupEntry,
    type RadioGroupFloaterBounds,
    RadioGroupStyles,
    RadioGroupUtils,
} from "@thewaver/ss-components";

import { ElementFaderReactUtils } from "../../../Abstracts/ElementFader/ElementFaderReact.utils";
import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { RadioGroupContextProvider } from "./RadioGroup.context";
import type { RadioGroupReactContextType } from "./RadioGroup.context.types";
import type { RadioGroupProps } from "./RadioGroup.types";

export const RadioGroup = <T,>(props: RadioGroupProps<T>) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const floaterRef = useRef<HTMLDivElement | null>(null);

    const fallbackName = useId();

    const [entries, setEntries] = useState<RadioGroupEntry[]>([]);
    const [measuredBounds, setMeasuredBounds] = useState<RadioGroupFloaterBounds>();

    const [value, setValue] = props.valueState;
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

    const floaterBounds = RadioGroupUtils.computeFloaterBounds(
        layout,
        measuredBounds,
        selectedEntry === undefined
            ? undefined
            : RadioGroupUtils.computePlacement(orderedEntries, layout, selectedEntry),
    );

    const isFloaterShown = selectedEntry !== undefined && floaterBounds !== undefined;

    const floaterFader = ElementFaderReactUtils.useFader(isFloaterShown, { transitionDurationMs, ref: floaterRef });

    useEffect(() => {
        if (floaterFader.isVisible) return;

        setMeasuredBounds(undefined);
    }, [floaterFader.isVisible]);

    const hasFloater = props.renderFloater !== undefined;
    const selectedElement = selectedEntry?.getElementRef();

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!hasFloater || layout !== undefined || !root || !selectedElement) return;

        return RadioGroupUtils.observeSelectedBounds(root, selectedElement, setMeasuredBounds);
    }, [hasFloater, layout, selectedElement]);

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

    const floater = hasFloater && floaterFader.isVisible && floaterBounds && (
        <div
            ref={floaterRef}
            className={RadioGroupStyles.radioGroupFloater}
            style={{ ...floaterBounds, transitionDuration: `${transitionDurationMs}ms` }}
        >
            {props.renderFloater!(floaterFader.transitionTarget, transitionDurationMs)}
        </div>
    );

    const content = (
        <>
            {floater}
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

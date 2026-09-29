import { Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    RADIO_GROUP_DEFAULTS,
    type RadioGroupContextType,
    type RadioGroupEntry,
    type RadioGroupFloaterBounds,
    RadioGroupUtils,
    RadioGroupStyles as styles,
} from "@thewaver/ss-components";

import { ElementFaderSolidUtils } from "../../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { access, accessSignal } from "../../../Utils/propUtils";
import { RadioGroupContextProvider } from "./RadioGroup.context";
import type { RadioGroupProps } from "./RadioGroupSolid.types";

export const RadioGroup = <T,>(props: RadioGroupProps<T>) => {
    const valueSignal = accessSignal(() => props.value);

    const fallbackName = createUniqueId();

    const [getEntries, setEntries] = createSignal<RadioGroupEntry[]>([]);
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getMeasuredBounds, setMeasuredBounds] = createSignal<RadioGroupFloaterBounds>();

    const getOrientation = createMemo(() => access(props.orientation) ?? RADIO_GROUP_DEFAULTS.orientation);

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: getEntries().length }));

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? RADIO_GROUP_DEFAULTS.transitionDurationMs,
    );

    const getOrderedEntries = createMemo(() => RadioGroupUtils.orderEntries(getEntries()));

    const getNavigableEntries = createMemo(() => RadioGroupUtils.computeNavigableEntries(getOrderedEntries()));

    const getRovingEntry = createMemo(() =>
        RadioGroupUtils.computeRovingEntry(getNavigableEntries(), valueSignal[0]()),
    );

    const getSelectedEntry = createMemo(() =>
        RadioGroupUtils.computeSelectedEntry(getOrderedEntries(), valueSignal[0]()),
    );

    const computePlacement = (entry: RadioGroupEntry) =>
        RadioGroupUtils.computePlacement(getOrderedEntries(), getLayout(), entry);

    const getFloaterBounds = createMemo(() => {
        const selected = getSelectedEntry();

        return RadioGroupUtils.computeFloaterBounds(
            getLayout(),
            getMeasuredBounds(),
            selected === undefined ? undefined : computePlacement(selected),
        );
    });

    const getIsFloaterShown = createMemo(() => getSelectedEntry() !== undefined && getFloaterBounds() !== undefined);

    const [getFloaterRef, setFloaterRef] = createSignal<HTMLElement>();

    const floaterFader = ElementFaderSolidUtils.createFader(getIsFloaterShown, {
        getTransitionDurationMs,
        getRef: getFloaterRef,
    });

    createEffect(() => {
        if (floaterFader.getIsVisible()) return;

        setMeasuredBounds(undefined);
    });

    createEffect(() => {
        if (!props.renderFloater || getLayout() !== undefined) return;

        const rootRef = getRootRef();
        const selectedItem = getSelectedEntry()?.getElementRef();

        if (!rootRef || !selectedItem) return;

        onCleanup(RadioGroupUtils.observeSelectedBounds(rootRef, selectedItem, setMeasuredBounds));
    });

    const context: RadioGroupContextType = {
        getName: () => access(props.name) ?? fallbackName,
        getValue: () => valueSignal[0](),
        setValue: (value) => valueSignal[1](() => value as T),
        computeIsTabbable: (value) => getRovingEntry()?.getValue() === value,
        computePlacement,
        register: (entry) => {
            setEntries((prev) => [...prev, entry]);

            onCleanup(() => {
                setEntries((prev) => prev.filter((item) => item !== entry));
            });
        },
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const next = RadioGroupUtils.computeKeyTarget(e.key, getNavigableEntries(), {
            focusedElement: document.activeElement,
            rovingEntry: getRovingEntry(),
            direction: getLayout() === undefined ? getDirection() : undefined,
        });

        if (next === undefined) return;

        e.preventDefault();

        next.getElementRef()?.focus();

        if (!next.getIsDisabled()) context.setValue(next.getValue());
    };

    const renderItems = () => <RadioGroupContextProvider value={context}>{props.children}</RadioGroupContextProvider>;

    const renderFloater = () =>
        props.renderFloater &&
        floaterFader.getIsVisible() &&
        getFloaterBounds() && (
            <div
                ref={setFloaterRef}
                class={styles.radioGroupFloater}
                style={{ ...getFloaterBounds(), "transition-duration": `${getTransitionDurationMs()}ms` }}
            >
                {props.renderFloater(floaterFader.getTransitionTarget, getTransitionDurationMs)}
            </div>
        );

    return (
        <div
            ref={setRootRef}
            class={getLayout() === undefined ? styles.radioGroupRoot : styles.radioGroupPlacedRoot}
            style={{
                "flex-direction": getOrientation() === "horizontal" ? "row" : "column",
                "gap": `${access(props.gap) ?? RADIO_GROUP_DEFAULTS.gap}px`,
            }}
            role="radiogroup"
            aria-label={access(props.ariaLabel)}
            aria-required={access(props.isRequired) || undefined}
            aria-invalid={access(props.hasError) || undefined}
            onKeyDown={handleKeyDown}
        >
            <Show
                when={getLayout()}
                fallback={
                    <>
                        {renderFloater()}
                        {renderItems()}
                    </>
                }
            >
                {(getResolved) => (
                    <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                        {renderFloater()}
                        {renderItems()}
                    </PlacementBox>
                )}
            </Show>
        </div>
    );
};

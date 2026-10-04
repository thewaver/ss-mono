import { Show, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    RADIO_GROUP_DEFAULTS,
    type RadioGroupContextType,
    type RadioGroupEntry,
    RadioGroupUtils,
    FloaterStyles as floaterStyles,
    RadioGroupStyles as styles,
} from "@thewaver/ss-components";

import { FloaterSolidUtils } from "../../../Abstracts/Floater/FloaterSolid.utils";
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

    const [getHoveredEntry, setHoveredEntry] = createSignal<RadioGroupEntry>();
    const [getFocusedEntry, setFocusedEntry] = createSignal<RadioGroupEntry>();

    const findEntry = (target: EventTarget | null) =>
        target instanceof Node
            ? getOrderedEntries().find((entry) => entry.getElementRef()?.parentElement?.contains(target) ?? false)
            : undefined;

    const createFloater = (getIsEnabled: () => boolean, getEntry: () => RadioGroupEntry | undefined) =>
        FloaterSolidUtils.create({
            getIsEnabled,
            getContainer: () => (getLayout() === undefined ? getRootRef() : undefined),
            getTarget: () => getEntry()?.getElementRef()?.offsetParent as HTMLElement | undefined,
            getLayout,
            getPlacement: () => {
                const entry = getEntry();

                return entry === undefined ? undefined : computePlacement(entry);
            },
            getTransitionDurationMs,
        });

    const selectionFloater = createFloater(() => props.renderSelectionFloater !== undefined, getSelectedEntry);

    const highlightFloater = createFloater(
        () => props.renderHighlightFloater !== undefined,
        () => getHoveredEntry() ?? getFocusedEntry(),
    );

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

    const renderFloater = (
        floater: ReturnType<typeof createFloater>,
        renderContent: RadioGroupProps<T>["renderSelectionFloater"],
    ) => (
        <Show when={floater.getIsRendered()}>
            <div
                ref={floater.setRef}
                class={floaterStyles.floater}
                style={{ ...floater.getBounds(), "transition-duration": `${getTransitionDurationMs()}ms` }}
            >
                {renderContent?.(floater.getVisibilityTarget, getTransitionDurationMs)}
            </div>
        </Show>
    );

    const renderFloaters = () => (
        <>
            {renderFloater(highlightFloater, props.renderHighlightFloater)}
            {renderFloater(selectionFloater, props.renderSelectionFloater)}
        </>
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
            onPointerOver={(e) => setHoveredEntry(findEntry(e.target))}
            onPointerLeave={() => setHoveredEntry(undefined)}
            onFocusIn={(e) => setFocusedEntry(findEntry(e.target))}
            onFocusOut={() => setFocusedEntry(undefined)}
        >
            <Show
                when={getLayout()}
                fallback={
                    <>
                        {renderFloaters()}
                        {renderItems()}
                    </>
                }
            >
                {(getResolved) => (
                    <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                        {renderFloaters()}
                        {renderItems()}
                    </PlacementBox>
                )}
            </Show>
        </div>
    );
};

import { Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { ElementFaderUtils } from "../../../Abstracts/ElementFader/ElementFader.utils";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import type { PlacementRect } from "../../../Abstracts/Placement/Placement.types";
import { PlacementUtils } from "../../../Abstracts/Placement/Placement.utils";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { access, accessSignal } from "../../../Utils/propUtils";
import { RADIO_GROUP_DEFAULTS } from "./RadioGroup.const";
import { RadioGroupContextProvider } from "./RadioGroup.context";
import type { RadioGroupContextType, RadioGroupEntry } from "./RadioGroup.context.types";
import type { RadioGroupProps } from "./RadioGroup.types";

import * as styles from "./RadioGroup.css";

const NO_ANGLE = 0;
const HALF = 0.5;
const MISSING_ENTRY = -1;

export const RadioGroup = <T,>(props: RadioGroupProps<T>) => {
    const valueSignal = accessSignal(() => props.valueSignal);

    const fallbackName = createUniqueId();

    const [getEntries, setEntries] = createSignal<RadioGroupEntry[]>([]);
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getMeasuredBounds, setMeasuredBounds] = createSignal<
        { [k in "top" | "left" | "width" | "height"]: string } | undefined
    >();

    const getOrientation = createMemo(() => access(props.orientation) ?? RADIO_GROUP_DEFAULTS.orientation);

    const getLayout = createMemo(() => props.computeLayout?.({ itemCount: getEntries().length }));

    const getDirection = NavigatorUtils.createDirectionSignal(getRootRef);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? RADIO_GROUP_DEFAULTS.transitionDurationMs,
    );

    const getOrderedEntries = createMemo(() => {
        const entries = getEntries();
        const refs = entries.map((entry) => entry.getElementRef());

        if (refs.some((ref) => ref === undefined)) return entries;

        return [...entries].sort((a, b) =>
            a.getElementRef()!.compareDocumentPosition(b.getElementRef()!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
    });

    const getNavigableEntries = createMemo(() =>
        getOrderedEntries().filter((entry) => !entry.getIsDisabled() || entry.getIsReachable()),
    );

    const getRovingEntry = createMemo(() => {
        const navigable = getNavigableEntries();
        const value = valueSignal[0]();

        return navigable.find((entry) => entry.getValue() === value) ?? navigable[0];
    });

    const getSelectedEntry = createMemo(() =>
        getOrderedEntries().find((entry) => entry.getValue() === valueSignal[0]()),
    );

    const computePlacement = (entry: RadioGroupEntry) => {
        const index = getOrderedEntries().indexOf(entry);

        return index === MISSING_ENTRY ? undefined : getLayout()?.placements[index];
    };

    const toPlacedBounds = (placement: PlacementRect) => ({
        top: PlacementUtils.toContainerWidth(placement.topShare - placement.heightShare * HALF),
        left: PlacementUtils.toContainerWidth(placement.leftShare - placement.widthShare * HALF),
        width: PlacementUtils.toContainerWidth(placement.widthShare),
        height: PlacementUtils.toContainerWidth(placement.heightShare),
        transform: `rotate(${placement.angle ?? NO_ANGLE}deg)`,
    });

    const getFloaterBounds = createMemo(() => {
        const layout = getLayout();
        const selected = getSelectedEntry();
        const placement = selected === undefined ? undefined : computePlacement(selected);

        if (layout === undefined) return getMeasuredBounds();
        if (placement === undefined) return undefined;

        return toPlacedBounds(placement);
    });

    const getIsFloaterShown = createMemo(() => getSelectedEntry() !== undefined && getFloaterBounds() !== undefined);

    const [getFloaterRef, setFloaterRef] = createSignal<HTMLElement>();

    const floaterFader = ElementFaderUtils.createFader(getIsFloaterShown, {
        getTransitionDurationMs,
        getRef: getFloaterRef,
    });

    createEffect(() => {
        if (floaterFader.getIsVisible()) return;

        setMeasuredBounds(undefined);
    });

    createEffect(() => {
        let selectedItemObserver: ResizeObserver | undefined;

        onCleanup(() => {
            selectedItemObserver?.disconnect();
        });

        if (!props.renderFloater || getLayout() !== undefined) return;

        const rootRef = getRootRef();
        const selectedItem = getSelectedEntry()?.getElementRef();
        const selectedWrapper = selectedItem?.offsetParent as HTMLElement | null;

        if (!rootRef || !selectedWrapper) return;

        selectedItemObserver = new ResizeObserver(() => {
            setMeasuredBounds({
                top: `${selectedWrapper.offsetTop}px`,
                left: `${selectedWrapper.offsetLeft}px`,
                width: `${selectedWrapper.offsetWidth}px`,
                height: `${selectedWrapper.offsetHeight}px`,
            });
        });
        selectedItemObserver.observe(rootRef);
        selectedItemObserver.observe(selectedWrapper);
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
        const navigable = getNavigableEntries();

        if (navigable.length < 1) return;

        const focused = navigable.find((entry) => entry.getElementRef() === document.activeElement);
        const from = focused ?? getRovingEntry();
        const position = NavigatorUtils.computeNextPosition(
            e.key,
            from ? navigable.indexOf(from) : 0,
            navigable.length,
            { orientation: "both", direction: getLayout() === undefined ? getDirection() : undefined },
        );

        if (position === undefined) return;

        e.preventDefault();

        const next = navigable[position];

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

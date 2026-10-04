import { type SlotsType, computed, defineComponent, shallowRef, useId } from "vue";

import {
    FloaterStyles,
    RADIO_GROUP_DEFAULTS,
    type RadioGroupEntry,
    RadioGroupStyles,
    RadioGroupUtils,
} from "@thewaver/ss-components";

import { FloaterVueUtils } from "../../../Abstracts/Floater/FloaterVue.utils";
import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { provideRadioGroupContext } from "./RadioGroup.context";
import type { RadioGroupProps, RadioGroupSlots } from "./RadioGroup.types";

export const RadioGroup = defineComponent(
    <T,>(props: RadioGroupProps<T>, { slots }: SlotsContext<RadioGroupSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();

        const fallbackName = useId();

        const value = useTwoWay(props, "value");

        const entries = shallowRef<RadioGroupEntry[]>([]);
        const hoveredEntry = shallowRef<RadioGroupEntry>();
        const focusedEntry = shallowRef<RadioGroupEntry>();

        const getTransitionDurationMs = () => props.transitionDurationMs ?? RADIO_GROUP_DEFAULTS.transitionDurationMs;

        const direction = NavigatorVueUtils.useDirection(rootRef);

        const layout = computed(() => props.computeLayout?.({ itemCount: entries.value.length }));

        const orderedEntries = computed(() => RadioGroupUtils.orderEntries(entries.value));
        const navigableEntries = computed(() => RadioGroupUtils.computeNavigableEntries(orderedEntries.value));
        const rovingEntry = computed(() => RadioGroupUtils.computeRovingEntry(navigableEntries.value, value.value));
        const selectedEntry = computed(() => RadioGroupUtils.computeSelectedEntry(orderedEntries.value, value.value));

        const findEntry = (target: EventTarget | null) =>
            target instanceof Node
                ? orderedEntries.value.find((entry) => entry.getElementRef()?.parentElement?.contains(target) ?? false)
                : undefined;

        const useEntryFloater = (isEnabled: () => boolean, getEntry: () => RadioGroupEntry | undefined) =>
            FloaterVueUtils.useFloater({
                isEnabled,
                container: () => (layout.value === undefined ? rootRef.value : undefined),
                target: () => getEntry()?.getElementRef()?.offsetParent as HTMLElement | undefined,
                layout,
                placement: () => {
                    const entry = getEntry();

                    return entry === undefined
                        ? undefined
                        : RadioGroupUtils.computePlacement(orderedEntries.value, layout.value, entry);
                },
                transitionDurationMs: getTransitionDurationMs,
            });

        const selectionFloater = useEntryFloater(
            () => slots.renderSelectionFloater !== undefined,
            () => selectedEntry.value,
        );

        const highlightFloater = useEntryFloater(
            () => slots.renderHighlightFloater !== undefined,
            () => hoveredEntry.value ?? focusedEntry.value,
        );

        provideRadioGroupContext({
            getName: () => props.name ?? fallbackName,
            getValue: () => value.value,
            setValue: (next) => {
                value.value = next as T;
            },
            computeIsTabbable: (candidate) => rovingEntry.value?.getValue() === candidate,
            computePlacement: (entry) => RadioGroupUtils.computePlacement(orderedEntries.value, layout.value, entry),
            register: (entry) => {
                entries.value = [...entries.value, entry];

                return () => {
                    entries.value = entries.value.filter((item) => item !== entry);
                };
            },
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            const next = RadioGroupUtils.computeKeyTarget(e.key, navigableEntries.value, {
                focusedElement: document.activeElement,
                rovingEntry: rovingEntry.value,
                direction: layout.value === undefined ? direction.value : undefined,
            });

            if (next === undefined) return;

            e.preventDefault();

            next.getElementRef()?.focus();

            if (!next.getIsDisabled()) value.value = next.getValue() as T;
        };

        return () => {
            const orientation = props.orientation ?? RADIO_GROUP_DEFAULTS.orientation;
            const transitionDurationMs = getTransitionDurationMs();

            const renderFloater = (
                floater: typeof selectionFloater,
                renderContent: RadioGroupSlots["renderSelectionFloater"],
            ) =>
                floater.isRendered.value && (
                    <div
                        ref={floater.setRef}
                        class={FloaterStyles.floater}
                        style={{ ...floater.bounds.value, transitionDuration: `${transitionDurationMs}ms` }}
                    >
                        {callSlot(renderContent, {
                            visibilityTarget: floater.visibilityTarget.value,
                            transitionDurationMs,
                        })}
                    </div>
                );

            const content = [
                renderFloater(highlightFloater, slots.renderHighlightFloater),
                renderFloater(selectionFloater, slots.renderSelectionFloater),
                slots.default?.(),
            ];

            return (
                <div
                    ref={rootRef}
                    class={
                        layout.value === undefined
                            ? RadioGroupStyles.radioGroupRoot
                            : RadioGroupStyles.radioGroupPlacedRoot
                    }
                    style={{
                        flexDirection: orientation === "horizontal" ? "row" : "column",
                        gap: `${props.gap ?? RADIO_GROUP_DEFAULTS.gap}px`,
                    }}
                    role="radiogroup"
                    aria-label={props.ariaLabel}
                    aria-required={props.isRequired || undefined}
                    aria-invalid={props.hasError || undefined}
                    onKeydown={handleKeyDown}
                    onPointerover={(e) => {
                        hoveredEntry.value = findEntry(e.target);
                    }}
                    onPointerleave={() => {
                        hoveredEntry.value = undefined;
                    }}
                    onFocusin={(e) => {
                        focusedEntry.value = findEntry(e.target);
                    }}
                    onFocusout={() => {
                        focusedEntry.value = undefined;
                    }}
                >
                    {layout.value ? (
                        <PlacementBox layout={layout.value} computeEffect={props.computeEffect}>
                            {{ default: () => content }}
                        </PlacementBox>
                    ) : (
                        content
                    )}
                </div>
            );
        };
    },
    {
        name: "RadioGroup",
        slots: Object as SlotsType<RadioGroupSlots>,
        props: declareProps<RadioGroupProps<unknown>>({
            "orientation": null,
            "gap": null,
            "name": null,
            "ariaLabel": null,
            "hasError": Boolean,
            "isRequired": Boolean,
            "transitionDurationMs": null,
            "value": null,
            "onUpdate:value": null,
            "computeLayout": null,
            "computeEffect": null,
        }),
    },
);

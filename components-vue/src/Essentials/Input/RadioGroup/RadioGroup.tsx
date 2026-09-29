import { type SlotsType, computed, defineComponent, shallowRef, useId } from "vue";

import {
    RADIO_GROUP_DEFAULTS,
    type RadioGroupEntry,
    type RadioGroupFloaterBounds,
    RadioGroupStyles,
    RadioGroupUtils,
} from "@thewaver/ss-components";

import { ElementFaderVueUtils } from "../../../Abstracts/ElementFader/ElementFaderVue.utils";
import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { provideRadioGroupContext } from "./RadioGroup.context";
import type { RadioGroupProps, RadioGroupSlots } from "./RadioGroup.types";

export const RadioGroup = defineComponent(
    <T,>(props: RadioGroupProps<T>, { slots }: SlotsContext<RadioGroupSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const floaterRef = shallowRef<HTMLDivElement>();

        const fallbackName = useId();

        const value = useTwoWay(props, "value");

        const entries = shallowRef<RadioGroupEntry[]>([]);
        const measuredBounds = shallowRef<RadioGroupFloaterBounds>();

        const getTransitionDurationMs = () => props.transitionDurationMs ?? RADIO_GROUP_DEFAULTS.transitionDurationMs;

        const direction = NavigatorVueUtils.useDirection(rootRef);

        const layout = computed(() => props.computeLayout?.({ itemCount: entries.value.length }));

        const orderedEntries = computed(() => RadioGroupUtils.orderEntries(entries.value));
        const navigableEntries = computed(() => RadioGroupUtils.computeNavigableEntries(orderedEntries.value));
        const rovingEntry = computed(() => RadioGroupUtils.computeRovingEntry(navigableEntries.value, value.value));
        const selectedEntry = computed(() => RadioGroupUtils.computeSelectedEntry(orderedEntries.value, value.value));

        const floaterBounds = computed(() =>
            RadioGroupUtils.computeFloaterBounds(
                layout.value,
                measuredBounds.value,
                selectedEntry.value === undefined
                    ? undefined
                    : RadioGroupUtils.computePlacement(orderedEntries.value, layout.value, selectedEntry.value),
            ),
        );

        const floaterFader = ElementFaderVueUtils.useFader(
            () => selectedEntry.value !== undefined && floaterBounds.value !== undefined,
            { transitionDurationMs: getTransitionDurationMs, ref: floaterRef },
        );

        watchAfterRender([floaterFader.isVisible], ([isVisible]) => {
            if (isVisible) return;

            measuredBounds.value = undefined;
        });

        watchAfterRender(
            [() => slots.renderFloater !== undefined, layout, () => selectedEntry.value?.getElementRef()],
            ([hasFloater, placedLayout, selectedElement]) => {
                const root = rootRef.value;

                if (!hasFloater || placedLayout !== undefined || !root || !selectedElement) return;

                return RadioGroupUtils.observeSelectedBounds(root, selectedElement, (bounds) => {
                    measuredBounds.value = bounds;
                });
            },
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
            const bounds = floaterBounds.value;

            const content = [
                slots.renderFloater && floaterFader.isVisible.value && bounds && (
                    <div
                        ref={floaterRef}
                        class={RadioGroupStyles.radioGroupFloater}
                        style={{ ...bounds, transitionDuration: `${transitionDurationMs}ms` }}
                    >
                        {callSlot(slots.renderFloater, {
                            visibilityTarget: floaterFader.transitionTarget.value,
                            transitionDurationMs,
                        })}
                    </div>
                ),
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

import { type SlotsType, computed, defineComponent } from "vue";

import { FORMATION_DEFAULTS, type PlacementRect } from "@thewaver/ss-components";

import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { FormationProps, FormationSlots } from "./Formation.types";

const EMPTY_PLACEMENT: PlacementRect = { topShare: 0, leftShare: 0, widthShare: 0, heightShare: 0 };
const FIRST_OCCURRENCE = 0;
const NEXT = 1;

export const Formation = defineComponent(
    <T,>(props: FormationProps<T>, { slots }: SlotsContext<FormationSlots<T>>) => {
        let knownItemIds = new Map<T, number>();
        let nextId = 0;

        const itemCount = computed(() => props.items.length);

        const layout = computed(() => props.computeLayout({ itemCount: itemCount.value }));

        return () => {
            const transitionDurationMs = props.transitionDurationMs ?? FORMATION_DEFAULTS.transitionDurationMs;
            const staggerMs = props.staggerMs ?? FORMATION_DEFAULTS.staggerMs;
            const count = itemCount.value;

            const itemIds = new Map<T, number>();

            props.items.forEach((item) => {
                if (itemIds.has(item)) return;

                itemIds.set(item, knownItemIds.get(item) ?? nextId++);
            });

            knownItemIds = itemIds;

            const occurrences = new Map<T, number>();

            return (
                <PlacementBox
                    layout={layout.value}
                    computeEffect={props.computeEffect}
                    transitionDurationMs={transitionDurationMs}
                >
                    {props.items.map((item, index) => {
                        const occurrence = occurrences.get(item) ?? FIRST_OCCURRENCE;
                        const placement = layout.value.placements[index] ?? EMPTY_PLACEMENT;

                        occurrences.set(item, occurrence + NEXT);

                        return (
                            <PlacementItem
                                key={`${itemIds.get(item)}:${occurrence}`}
                                placement={placement}
                                stackAt={props.isStackedInReverse ? count - index : index + NEXT}
                                transitionDelayMs={index * staggerMs}
                            >
                                {callSlot(slots.renderItem, { item, state: { index, itemCount: count, placement } })}
                            </PlacementItem>
                        );
                    })}
                </PlacementBox>
            );
        };
    },
    {
        name: "Formation",
        slots: Object as SlotsType<FormationSlots<any>>,
        props: declareProps<FormationProps<unknown>>({
            isStackedInReverse: Boolean,
            computeLayout: null,
            computeEffect: null,
            transitionDurationMs: null,
            staggerMs: null,
            items: null,
        }),
    },
);

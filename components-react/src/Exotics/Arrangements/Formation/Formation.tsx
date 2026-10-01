import { useMemo, useRef } from "react";

import { FORMATION_DEFAULTS, type PlacementRect } from "@thewaver/ss-components";

import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../../Primitives/PlacementItem/PlacementItem";
import type { FormationProps } from "./Formation.types";

const EMPTY_PLACEMENT: PlacementRect = { topShare: 0, leftShare: 0, widthShare: 0, heightShare: 0 };
const FIRST_OCCURRENCE = 0;
const NEXT = 1;

export const Formation = <T,>(props: FormationProps<T>) => {
    const itemIdsRef = useRef(new Map<T, number>());
    const nextIdRef = useRef(0);

    const itemCount = props.items.length;
    const transitionDurationMs = props.transitionDurationMs ?? FORMATION_DEFAULTS.transitionDurationMs;
    const staggerMs = props.staggerMs ?? FORMATION_DEFAULTS.staggerMs;

    const layout = useMemo(() => props.computeLayout({ itemCount }), [props.computeLayout, itemCount]);

    const itemIds = new Map<T, number>();

    props.items.forEach((item) => {
        if (itemIds.has(item)) return;

        const id = itemIdsRef.current.get(item) ?? nextIdRef.current++;

        itemIds.set(item, id);
    });

    itemIdsRef.current = itemIds;

    const occurrences = new Map<T, number>();

    return (
        <PlacementBox layout={layout} computeEffect={props.computeEffect} transitionDurationMs={transitionDurationMs}>
            {props.items.map((item, index) => {
                const occurrence = occurrences.get(item) ?? FIRST_OCCURRENCE;
                const placement = layout.placements[index] ?? EMPTY_PLACEMENT;

                occurrences.set(item, occurrence + NEXT);

                return (
                    <PlacementItem
                        key={`${itemIds.get(item)}:${occurrence}`}
                        placement={placement}
                        stackAt={props.isStackedInReverse ? itemCount - index : index + NEXT}
                        transitionDelayMs={index * staggerMs}
                    >
                        {props.renderItem(item, { index, itemCount, placement })}
                    </PlacementItem>
                );
            })}
        </PlacementBox>
    );
};

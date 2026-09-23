import { For, createMemo } from "solid-js";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import { FORMATION_DEFAULTS } from "./Formation.const";
import type { FormationProps } from "./Formation.types";

const EMPTY_PLACEMENT: PlacementRect = { top: 0, left: 0, width: 0, height: 0 };

export const Formation = <T,>(props: FormationProps<T>) => {
    const getItemCount = createMemo(() => access(props.items).length);

    const getLayout = createMemo(() => props.computeLayout({ itemCount: getItemCount() }));

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? FORMATION_DEFAULTS.transitionDurationMs,
    );

    const getStaggerMs = createMemo(() => access(props.staggerMs) ?? FORMATION_DEFAULTS.staggerMs);

    const getPlacement = (index: number) => getLayout().placements[index] ?? EMPTY_PLACEMENT;

    const getStackAt = (index: number) => (access(props.isStackedInReverse) ? getItemCount() - index : index + 1);

    return (
        <PlacementBox
            layout={getLayout}
            computeEffect={props.computeEffect}
            transitionDurationMs={getTransitionDurationMs}
        >
            <For each={access(props.items)}>
                {(item, getIndex) => (
                    <PlacementItem
                        placement={() => getPlacement(getIndex())}
                        stackAt={() => getStackAt(getIndex())}
                        transitionDelayMs={() => getIndex() * getStaggerMs()}
                    >
                        {props.renderItem(
                            () => item,
                            () => ({
                                index: getIndex(),
                                itemCount: getItemCount(),
                                placement: getPlacement(getIndex()),
                            }),
                        )}
                    </PlacementItem>
                )}
            </For>
        </PlacementBox>
    );
};

import { Index, createMemo } from "solid-js";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import type { FormationProps } from "./Formation.types";

const EMPTY_PLACEMENT: PlacementRect = { top: 0, left: 0, width: 0, height: 0 };

export const Formation = <T,>(props: FormationProps<T>) => {
    const getItemCount = createMemo(() => access(props.items).length);

    const getLayout = createMemo(() => props.computeLayout({ itemCount: getItemCount() }));

    const getPlacement = (index: number) => getLayout().placements[index] ?? EMPTY_PLACEMENT;

    const getStackAt = (index: number) => (access(props.isStackedInReverse) ? getItemCount() - index : index + 1);

    return (
        <PlacementBox layout={getLayout}>
            <Index each={access(props.items)}>
                {(getItem, index) => (
                    <PlacementItem placement={() => getPlacement(index)} stackAt={() => getStackAt(index)}>
                        {props.renderItem(getItem, () => ({
                            index,
                            itemCount: getItemCount(),
                            placement: getPlacement(index),
                        }))}
                    </PlacementItem>
                )}
            </Index>
        </PlacementBox>
    );
};

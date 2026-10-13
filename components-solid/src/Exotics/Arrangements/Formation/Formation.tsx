import { For, createMemo } from "solid-js";

import { FORMATION_DEFAULTS } from "@thewaver/ss-components";
import { FormationConst } from "@thewaver/ss-components/internal";

import { PlacementBox } from "../../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../../Utils/propUtils";
import type { FormationProps } from "./FormationSolid.types";

export const Formation = <T,>(props: FormationProps<T>) => {
    const getItemCount = createMemo(() => access(props.items).length);

    const getLayout = createMemo(() => props.computeLayout({ itemCount: getItemCount() }));

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? FORMATION_DEFAULTS.transitionDurationMs,
    );

    const getTransitionDelayMs = createMemo(
        () => access(props.transitionDelayMs) ?? FORMATION_DEFAULTS.transitionDelayMs,
    );

    const getPlacement = (index: number) => getLayout().placements[index] ?? FormationConst.EMPTY_PLACEMENT;

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
                        transitionDelayMs={() => getIndex() * getTransitionDelayMs()}
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

import { createSignal } from "solid-js";

import { PlacementLayoutUtils, ProximityUtils, Tree, access } from "@thewaver/ss-components-solid";
import type { ProximityEffectFn } from "@thewaver/ss-components-solid";
import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
import { MathUtils } from "@thewaver/ss-utils";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePageSolid.const";
import type { TreeLeaningDocsExampleProps } from "../TreePageSolid.types";

const REACH_ITEMS = 2.5;
const SHIFT_PERCENT = 8;
const BRIGHTEN_PERCENT = 60;
const FULL_PERCENT = 100;
const SHARP_POWER = 3;

const COLUMN = PlacementLayoutUtils.createColumn({ itemHeightRatio: 0.14, gapRatio: 0.15 });

const toStrength = (falloff: TreeFalloff, distance: number, reach: number) => {
    const linear = MathUtils.clamp01(1 - distance / reach);

    if (falloff === "linear") return linear;
    if (falloff === "sharp") return linear ** SHARP_POWER;

    return ProximityUtils.getDistanceFalloff(distance, reach);
};

type Props = TreeLeaningDocsExampleProps;

export const LeaningDocsExample = (props: Props) => {
    const expandedSignal = createSignal<string[]>(["src"]);

    const computeEffect: ProximityEffectFn = (defs) => {
        const strength = toStrength(access(props.falloff), defs.distance, defs.spacing * REACH_ITEMS);

        return { translateX: strength * SHIFT_PERCENT, brightness: FULL_PERCENT + strength * BRIGHTEN_PERCENT };
    };

    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={FILES}
            expanded={expandedSignal}
            ariaLabel={"Leaning repository"}
            computeLayout={COLUMN}
            computeEffect={computeEffect}
            renderNode={(getNode, getRenderProps) => (
                <PageTreeNodeContent isGliding renderProps={getRenderProps}>
                    {getNode().value}
                </PageTreeNodeContent>
            )}
        />
    );
};

import { useState } from "react";

import { PlacementLayoutUtils, ProximityUtils, Tree } from "@thewaver/ss-components-react";
import type { ProximityEffectFn } from "@thewaver/ss-components-react";
import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
import { MathUtils } from "@thewaver/ss-utils";

import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePageReact.const";
import type { TreeLeaningDocsExampleProps } from "../TreePageReact.types";

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
    const expandedState = useState<string[]>(["src"]);

    const computeEffect: ProximityEffectFn = (defs) => {
        const strength = toStrength(props.falloff, defs.distance, defs.spacing * REACH_ITEMS);

        return { translateX: strength * SHIFT_PERCENT, brightness: FULL_PERCENT + strength * BRIGHTEN_PERCENT };
    };

    return (
        <Tree
            renderHighlightFloater={renderPageHighlightFloater}
            nodes={FILES}
            expanded={expandedState}
            ariaLabel={"Leaning repository"}
            computeLayout={COLUMN}
            computeEffect={computeEffect}
            renderNode={(node, renderProps) => (
                <PageTreeNodeContent isGliding renderProps={renderProps}>
                    {node.value}
                </PageTreeNodeContent>
            )}
        />
    );
};

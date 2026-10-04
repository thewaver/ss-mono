import { useState } from "react";

import { PlacementLayoutUtils, ProximityUtils, Tree } from "@thewaver/ss-components-react";
import type { ProximityEffectFn } from "@thewaver/ss-components-react";
import { MathUtils } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater";
import { PageTreeNodeContent } from "../../../StyledComponents/TreeNodeContent/TreeNodeContent";
import { FILES } from "../TreePage.const";
import type { TreeExampleProps } from "../TreePage.types";

type Falloff = "smooth" | "linear" | "sharp";

const FALLOFFS: Falloff[] = ["smooth", "linear", "sharp"];
const REACH_ITEMS = 2.5;
const SHIFT_PERCENT = 8;
const BRIGHTEN_PERCENT = 60;
const FULL_PERCENT = 100;
const SHARP_POWER = 3;

const COLUMN = PlacementLayoutUtils.createColumn({ itemWidthRatio: 0.9, itemHeightRatio: 0.14, gapRatio: 0.15 });

const toStrength = (falloff: Falloff, distance: number, reach: number) => {
    const linear = MathUtils.clamp01(1 - distance / reach);

    if (falloff === "linear") return linear;
    if (falloff === "sharp") return linear ** SHARP_POWER;

    return ProximityUtils.getDistanceFalloff(distance, reach);
};

type Props = TreeExampleProps;

export const LeaningExample = (props: Props) => {
    const [falloff, setFalloff] = useState<Falloff>("smooth");

    const computeEffect: ProximityEffectFn = (defs) => {
        const strength = toStrength(falloff, defs.distance, defs.spacing * REACH_ITEMS);

        return { translateX: strength * SHIFT_PERCENT, brightness: FULL_PERCENT + strength * BRIGHTEN_PERCENT };
    };

    return (
        <>
            <Tree
                renderHighlightFloater={renderPageHighlightFloater}
                nodes={FILES}
                value={props.value}
                expanded={props.expanded}
                ariaLabel={"Leaning repository"}
                computeLayout={COLUMN}
                computeEffect={computeEffect}
                renderNode={(node, renderProps) => (
                    <PageTreeNodeContent isGliding renderProps={renderProps}>
                        {node.value}
                    </PageTreeNodeContent>
                )}
            />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"falloff"}
                    label={"Falloff"}
                    hint={
                        "How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest items move."
                    }
                >
                    <PageSelectField
                        value={falloff}
                        values={FALLOFFS}
                        ariaLabel={"Falloff"}
                        onChange={(next) => setFalloff(next)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

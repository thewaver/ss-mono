import { createSignal } from "solid-js";

import { PlacementLayoutUtils, ProximityUtils, Tree } from "@thewaver/ss-components-solid";
import type { ProximityEffectFn } from "@thewaver/ss-components-solid";
import { MathUtils } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
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
    const [getFalloff, setFalloff] = createSignal<Falloff>("smooth");

    const computeEffect: ProximityEffectFn = (defs) => {
        const strength = toStrength(getFalloff(), defs.distance, defs.spacing * REACH_ITEMS);

        return { translateX: strength * SHIFT_PERCENT, brightness: FULL_PERCENT + strength * BRIGHTEN_PERCENT };
    };

    return (
        <>
            <Tree
                nodes={() => FILES}
                value={props.value}
                expanded={props.expanded}
                ariaLabel={"Leaning repository"}
                computeLayout={COLUMN}
                computeEffect={computeEffect}
                renderNode={(getNode, getRenderProps) => (
                    <PageTreeNodeContent renderProps={getRenderProps}>{getNode().value}</PageTreeNodeContent>
                )}
            />

            <PageExampleKnobs>
                <PageProp
                    key={"falloff"}
                    label={"Falloff"}
                    hint={
                        "How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest items move."
                    }
                >
                    <PageSelectField
                        value={getFalloff}
                        values={() => FALLOFFS}
                        ariaLabel={"Falloff"}
                        onChange={(falloff) => setFalloff(() => falloff)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

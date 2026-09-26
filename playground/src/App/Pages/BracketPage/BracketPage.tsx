import { createMemo, createSignal } from "solid-js";

import { BRACKET_DEFAULTS, BRACKET_ORIENTATIONS, BRACKET_ROOT_SIDES, BracketConnectors } from "@thewaver/ss-components";
import type { BracketOrientation, BracketRootSide } from "@thewaver/ss-components";

import { BracketKnobs } from "../../Knobs/Brackets.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { NOTHING_PICKED } from "./BracketPage.const";
import type { BracketExampleProps } from "./BracketPage.types";
import { KnockoutExample } from "./Examples/Knockout";
import { OrgChartExample } from "./Examples/OrgChart";
import { SkillTreeExample } from "./Examples/SkillTree";

import { CONNECTOR_FROM_COLOR, CONNECTOR_TO_COLOR, ROUTE_FROM_COLOR, ROUTE_TO_COLOR } from "./BracketPage.css";

const EXAMPLES_ROOT = "/src/App/Pages/BracketPage/Examples";

const CONNECTOR_RADIUS = 14;
const CONNECTOR_WIDTH = 2;
const ROUTE_CONNECTOR_WIDTH = 3;
const WIDE_SPAN = 2;

export const BracketPage = () => {
    const [getLayerGap, setLayerGap] = createSignal(BRACKET_DEFAULTS.layerGap);
    const [getCrossGap, setCrossGap] = createSignal(BRACKET_DEFAULTS.crossGap);
    const [getOrientation, setOrientation] = createSignal<BracketOrientation>(BRACKET_DEFAULTS.orientation);
    const [getRootSide, setRootSide] = createSignal<BracketRootSide>(BRACKET_DEFAULTS.rootSide);
    const [getConnector, setConnector] = createSignal<BracketConnectors.SampleKey>(BracketConnectors.SAMPLE_KEYS[0]);
    const [getPicked, setPicked] = createSignal(NOTHING_PICKED);

    const getExamples = createMemo(() => {
        const commonProps: BracketExampleProps = {
            layerGap: getLayerGap,
            crossGap: getCrossGap,
            orientation: getOrientation,
            rootSide: getRootSide,
            onActivate: (value, placement) => setPicked(`${value}, node ${placement.id} in layer ${placement.layer}`),
            renderConnector: (getDefs) =>
                BracketConnectors.SAMPLE_CONNECTORS[getConnector()]({
                    defs: getDefs(),
                    radius: CONNECTOR_RADIUS,
                    width: getDefs().isOnFocusedRoute ? ROUTE_CONNECTOR_WIDTH : CONNECTOR_WIDTH,
                    fromColor: getDefs().isOnFocusedRoute ? ROUTE_FROM_COLOR : CONNECTOR_FROM_COLOR,
                    toColor: getDefs().isOnFocusedRoute ? ROUTE_TO_COLOR : CONNECTOR_TO_COLOR,
                }),
        };

        return [
            {
                key: "knockout",
                name: "Knockout",
                span: WIDE_SPAN,
                readout: () =>
                    `picked: ${getPicked()} — a full draw with its rounds named, every node feeding exactly two, and one seed withdrawn so the walk steps past it; focus a seed and its road to the final lights up`,
                component: () => (
                    <PageMeasureBox>
                        <KnockoutExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Knockout.tsx`,
            },
            {
                key: "orgChart",
                name: "Org chart",
                span: WIDE_SPAN,
                readout: () =>
                    "an uneven tree: three under one node, two under another, one that goes no further — a parent still lands between the outermost of the nodes it holds, whichever way round the board is turned",
                component: () => (
                    <PageMeasureBox>
                        <OrgChartExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/OrgChart.tsx`,
            },
            {
                key: "skillTree",
                name: "Skill tree",
                readout: () =>
                    "a chain of single children, which is what a bye looks like — each one level with the last, under headers that turn with the board",
                component: () => (
                    <PageMeasureBox>
                        <SkillTreeExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/SkillTree.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"connector"}
                    label={"Connectors"}
                    hint={"The line drawn between a match and the one it feeds: straight, elbowed, or curved."}
                >
                    <PageSelectField
                        value={getConnector}
                        values={() => BracketConnectors.SAMPLE_KEYS}
                        ariaLabel={"Connectors"}
                        onChange={(connector) => setConnector(() => connector)}
                    />
                </PageProp>

                <PageProp
                    key={"orientation"}
                    label={"Orientation"}
                    hint={"Whether the rounds run across the page or down it."}
                >
                    <PageSelectField
                        value={getOrientation}
                        values={() => BRACKET_ORIENTATIONS}
                        ariaLabel={"Orientation"}
                        onChange={(orientation) => setOrientation(() => orientation)}
                    />
                </PageProp>

                <PageProp
                    key={"rootSide"}
                    label={"Root side"}
                    hint={"Which end the final holds, and so which way the rounds read."}
                >
                    <PageSelectField
                        value={getRootSide}
                        values={() => BRACKET_ROOT_SIDES}
                        ariaLabel={"Root side"}
                        onChange={(side) => setRootSide(() => side)}
                    />
                </PageProp>

                <PageProp key={"layerGap"} label={"Layer gap (px)"} hint={"The space between one round and the next."}>
                    <PageNumberField
                        value={getLayerGap}
                        min={() => BracketKnobs.MIN_LAYER_GAP}
                        max={() => BracketKnobs.MAX_LAYER_GAP}
                        step={() => BracketKnobs.LAYER_GAP_STEP}
                        ariaLabel={"Layer gap in pixels"}
                        onInput={setLayerGap}
                    />
                </PageProp>

                <PageProp
                    key={"crossGap"}
                    label={"Row gap (px)"}
                    hint={"The space between two matches in the same round."}
                >
                    <PageNumberField
                        value={getCrossGap}
                        min={() => BracketKnobs.MIN_CROSS_GAP}
                        max={() => BracketKnobs.MAX_CROSS_GAP}
                        step={() => BracketKnobs.CROSS_GAP_STEP}
                        ariaLabel={"Row gap in pixels"}
                        onInput={setCrossGap}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

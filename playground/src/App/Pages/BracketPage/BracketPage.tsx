import { createMemo, createSignal } from "solid-js";

import { BracketConnectors } from "@thewaver/ss-components";
import type { BracketOrientation, BracketRootSide } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { NOTHING_PICKED } from "./BracketPage.const";
import type { BracketExampleProps } from "./BracketPage.types";
import { KnockoutExample } from "./Examples/Knockout";
import { OrgChartExample } from "./Examples/OrgChart";
import { SkillTreeExample } from "./Examples/SkillTree";

import { MEASURE_BOX_PADDING } from "../../PageComponents/MeasureBox/MeasureBox.css";
import { CONNECTOR_FROM_COLOR, CONNECTOR_TO_COLOR } from "./BracketPage.css";

const EXAMPLES_ROOT = "/src/App/Pages/BracketPage/Examples";

const CONNECTORS = ["flat", "rounded", "curved", "ballAndArrow"] as const;
const CONNECTOR_RADIUS = 14;
const CONNECTOR_WIDTH = 2;
const ORIENTATIONS: BracketOrientation[] = ["horizontal", "vertical"];
const ROOT_SIDES: BracketRootSide[] = ["end", "start"];
const STARTING_LAYER_GAP = 40;
const MIN_LAYER_GAP = 10;
const MAX_LAYER_GAP = 120;
const LAYER_GAP_STEP = 2;
const STARTING_CROSS_GAP = 12;
const MIN_CROSS_GAP = 0;
const MAX_CROSS_GAP = 60;
const CROSS_GAP_STEP = 2;
const WIDE_SPAN = 2;

export const BracketPage = () => {
    const [getLayerGap, setLayerGap] = createSignal(STARTING_LAYER_GAP);
    const [getCrossGap, setCrossGap] = createSignal(STARTING_CROSS_GAP);
    const [getOrientation, setOrientation] = createSignal<BracketOrientation>(ORIENTATIONS[0]);
    const [getRootSide, setRootSide] = createSignal<BracketRootSide>(ROOT_SIDES[0]);
    const [getConnector, setConnector] = createSignal<(typeof CONNECTORS)[number]>(CONNECTORS[0]);
    const [getPicked, setPicked] = createSignal(NOTHING_PICKED);

    const getExamples = createMemo(() => {
        const commonProps: BracketExampleProps = {
            layerGap: getLayerGap,
            crossGap: getCrossGap,
            orientation: getOrientation,
            rootSide: getRootSide,
            onActivate: setPicked,
            renderConnector: (getDefs) =>
                BracketConnectors.ALL[getConnector()]({
                    defs: getDefs(),
                    radius: CONNECTOR_RADIUS,
                    width: CONNECTOR_WIDTH,
                    fromColor: CONNECTOR_FROM_COLOR,
                    toColor: CONNECTOR_TO_COLOR,
                }),
        };

        return [
            {
                key: "knockout",
                name: "Knockout",
                span: WIDE_SPAN,
                readout: () =>
                    `picked: ${getPicked()} — a full draw, every node feeding exactly two, and one seed withdrawn so the walk steps past it`,
                component: () => (
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
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
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
                        <OrgChartExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/OrgChart.tsx`,
            },
            {
                key: "skillTree",
                name: "Skill tree",
                readout: () =>
                    "a chain of single children, which is what a bye looks like — each one level with the last",
                component: () => (
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
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
                <PageProp key={"connector"} label={"Connectors"}>
                    <PageSelectField
                        value={getConnector}
                        values={() => CONNECTORS}
                        ariaLabel={"Connectors"}
                        onChange={(connector) => setConnector(() => connector)}
                    />
                </PageProp>

                <PageProp key={"orientation"} label={"Orientation"}>
                    <PageSelectField
                        value={getOrientation}
                        values={() => ORIENTATIONS}
                        ariaLabel={"Orientation"}
                        onChange={(orientation) => setOrientation(() => orientation)}
                    />
                </PageProp>

                <PageProp key={"rootSide"} label={"Root side"}>
                    <PageSelectField
                        value={getRootSide}
                        values={() => ROOT_SIDES}
                        ariaLabel={"Root side"}
                        onChange={(side) => setRootSide(() => side)}
                    />
                </PageProp>

                <PageProp key={"layerGap"} label={"Layer gap (px)"}>
                    <PageNumberField
                        value={getLayerGap}
                        min={() => MIN_LAYER_GAP}
                        max={() => MAX_LAYER_GAP}
                        step={() => LAYER_GAP_STEP}
                        ariaLabel={"Layer gap in pixels"}
                        onInput={setLayerGap}
                    />
                </PageProp>

                <PageProp key={"crossGap"} label={"Row gap (px)"}>
                    <PageNumberField
                        value={getCrossGap}
                        min={() => MIN_CROSS_GAP}
                        max={() => MAX_CROSS_GAP}
                        step={() => CROSS_GAP_STEP}
                        ariaLabel={"Row gap in pixels"}
                        onInput={setCrossGap}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

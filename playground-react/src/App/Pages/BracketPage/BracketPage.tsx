import { useState } from "react";

import {
    BRACKET_DEFAULTS,
    BRACKET_ORIENTATIONS,
    BRACKET_ROOT_SIDES,
    BracketConnectors,
    MediaQueryMonitorReactUtils,
} from "@thewaver/ss-components-react";
import type { BracketConnectorDefs, BracketOrientation, BracketRootSide } from "@thewaver/ss-components-react";
import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";
import {
    CONNECTOR_FROM_COLOR,
    CONNECTOR_TO_COLOR,
    ROUTE_FROM_COLOR,
    ROUTE_TO_COLOR,
} from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageBeam } from "../../StyledComponents/Beam/Beam";
import { BEAM_PATHS, NOTHING_PICKED, computeRouteSpan, toConnectorBoard } from "./BracketPage.const";
import type { BracketExampleProps } from "./BracketPage.types";
import { FamilyExample } from "./Examples/Family";
import { KnockoutExample } from "./Examples/Knockout";
import { OrgChartExample } from "./Examples/OrgChart";
import { SkillTreeExample } from "./Examples/SkillTree";

const EXAMPLES_ROOT = "/src/App/Pages/BracketPage/Examples";

const CONNECTOR_RADIUS = 14;
const CONNECTOR_WIDTH = 2;
const ROUTE_CONNECTOR_WIDTH = 3;
const WIDE_SPAN = 2;
const NO_MOTION_DURATION_MS = 0;

export const BracketPage = () => {
    const [layerGap, setLayerGap] = useState(BRACKET_DEFAULTS.layerGap);
    const [crossGap, setCrossGap] = useState(BRACKET_DEFAULTS.crossGap);
    const [orientation, setOrientation] = useState<BracketOrientation>(BRACKET_DEFAULTS.orientation);
    const [rootSide, setRootSide] = useState<BracketRootSide>(BRACKET_DEFAULTS.rootSide);
    const [connector, setConnector] = useState<BracketConnectors.SampleKey>(BracketConnectors.SAMPLE_KEYS[0]);
    const [picked, setPicked] = useState(NOTHING_PICKED);
    const [transitionDurationMs, setTransitionDurationMs] = useState(BRACKET_DEFAULTS.transitionDurationMs);
    const [family, setFamily] = useState("");

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [isBeamPlaying, setIsBeamPlaying] = useState(!prefersReducedMotion);
    const [beamLengths, setBeamLengths] = useState<
        Record<string, { board: string; childId: string; lengthPx: number }>
    >({});

    const setBeamLength = (defs: BracketConnectorDefs, lengthPx: number | undefined) =>
        setBeamLengths((lengths) => {
            const { [defs.id]: _previous, ...others } = lengths;

            return lengthPx === undefined
                ? others
                : { ...others, [defs.id]: { board: toConnectorBoard(defs), childId: defs.childId, lengthPx } };
        });

    const computeBeamSpan = (defs: BracketConnectorDefs) =>
        computeRouteSpan(beamLengths, toConnectorBoard(defs), defs.childId);

    const commonProps: BracketExampleProps = {
        layerGap,
        crossGap,
        orientation,
        rootSide,
        onActivate: (value, placement) => setPicked(`${value}, node ${placement.id} in layer ${placement.layer}`),
        renderConnector: (defs) => (
            <>
                {BracketConnectors.SAMPLE_CONNECTORS[connector]({
                    defs,
                    radius: CONNECTOR_RADIUS,
                    width: defs.isOnFocusedRoute ? ROUTE_CONNECTOR_WIDTH : CONNECTOR_WIDTH,
                    fromColor: defs.isOnFocusedRoute ? ROUTE_FROM_COLOR : CONNECTOR_FROM_COLOR,
                    toColor: defs.isOnFocusedRoute ? ROUTE_TO_COLOR : CONNECTOR_TO_COLOR,
                })}

                {defs.isOnFocusedRoute && (
                    <PageBeam
                        d={BEAM_PATHS[connector](defs, CONNECTOR_RADIUS)}
                        direction={"backward"}
                        isPlaying={isBeamPlaying}
                        routeStartPx={computeBeamSpan(defs).startPx}
                        routeLengthPx={computeBeamSpan(defs).totalPx}
                        onLengthPx={(lengthPx) => setBeamLength(defs, lengthPx)}
                    />
                )}
            </>
        ),
    };

    const examples = [
        {
            key: "knockout",
            name: "Knockout",
            span: WIDE_SPAN,
            readout: () =>
                `picked: ${picked} — a full draw with its rounds named, every node feeding exactly two, and one seed withdrawn so the walk steps past it; focus a seed and its road to the final lights up`,
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
        {
            key: "family",
            name: "One family at a time",
            span: WIDE_SPAN,
            readout: () =>
                `showing: ${family} — the whole draw stays mounted and a camera frames one family at a time: what the focused node feeds, it with all its siblings, and what feeds them; walk on with the arrows, or page through with the buttons without leaving them, and the camera pans and zooms to fit; Zoom out fits the whole draw, and Zoom in goes back to the family`,
            component: () => (
                <FamilyExample
                    {...commonProps}
                    transitionDurationMs={prefersReducedMotion ? NO_MOTION_DURATION_MS : transitionDurationMs}
                    onFamilyChange={setFamily}
                />
            ),
            path: `${EXAMPLES_ROOT}/Family.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"connector"}
                    label={"Connectors"}
                    hint={"The line drawn between a match and the one it feeds: straight, elbowed, or curved."}
                >
                    <PageSelectField
                        value={connector}
                        values={BracketConnectors.SAMPLE_KEYS}
                        ariaLabel={"Connectors"}
                        onChange={(next) => setConnector(next)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isBeamPlaying"}
                    label={"Beams moving"}
                    hint={
                        "Whether the pulse runs along the lines between the focused node and the final. It starts stopped while the visitor has asked for reduced motion."
                    }
                >
                    <PageCheckField value={isBeamPlaying} ariaLabel={"Beams moving"} onChange={setIsBeamPlaying} />
                </PageProp>

                <PageProp
                    itemKey={"orientation"}
                    label={"Orientation"}
                    hint={"Whether the rounds run across the page or down it."}
                >
                    <PageSelectField
                        value={orientation}
                        values={BRACKET_ORIENTATIONS}
                        ariaLabel={"Orientation"}
                        onChange={(next) => setOrientation(next)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"rootSide"}
                    label={"Root side"}
                    hint={"Which end the final holds, and so which way the rounds read."}
                >
                    <PageSelectField
                        value={rootSide}
                        values={BRACKET_ROOT_SIDES}
                        ariaLabel={"Root side"}
                        onChange={(side) => setRootSide(side)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"layerGap"}
                    label={"Layer gap (px)"}
                    hint={"The space between one round and the next."}
                >
                    <PageNumberField
                        value={layerGap}
                        min={BracketKnobs.MIN_LAYER_GAP}
                        max={BracketKnobs.MAX_LAYER_GAP}
                        step={BracketKnobs.LAYER_GAP_STEP}
                        ariaLabel={"Layer gap in pixels"}
                        onInput={setLayerGap}
                    />
                </PageProp>

                <PageProp
                    itemKey={"crossGap"}
                    label={"Row gap (px)"}
                    hint={"The space between two matches in the same round."}
                >
                    <PageNumberField
                        value={crossGap}
                        min={BracketKnobs.MIN_CROSS_GAP}
                        max={BracketKnobs.MAX_CROSS_GAP}
                        step={BracketKnobs.CROSS_GAP_STEP}
                        ariaLabel={"Row gap in pixels"}
                        onInput={setCrossGap}
                    />
                </PageProp>

                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Glide (ms)"}
                    hint={
                        "How long the family example takes to glide from one family to the next. It is off while the visitor has asked for reduced motion."
                    }
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={BracketKnobs.MIN_TRANSITION_DURATION_MS}
                        max={BracketKnobs.MAX_TRANSITION_DURATION_MS}
                        step={BracketKnobs.TRANSITION_DURATION_STEP_MS}
                        isDisabled={prefersReducedMotion}
                        ariaLabel={"Glide in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};

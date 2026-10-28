import { Show, createMemo, createSignal } from "solid-js";

import {
    BRACKET_DEFAULTS,
    BRACKET_ORIENTATIONS,
    BRACKET_ROOT_SIDES,
    BracketConnectors,
    MediaQueryMonitorSolidUtils,
} from "@thewaver/ss-components-solid";
import type { BracketConnectorDefs, BracketOrientation, BracketRootSide } from "@thewaver/ss-components-solid";
import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";
import {
    CONNECTOR_RADIUS,
    CONNECTOR_WIDTH,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    NO_MOTION_DURATION_MS,
    ROUTE_CONNECTOR_WIDTH,
    WIDE_SPAN,
} from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.const";
import {
    CONNECTOR_FROM_COLOR,
    CONNECTOR_TO_COLOR,
    ROUTE_FROM_COLOR,
    ROUTE_TO_COLOR,
} from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageBeam } from "../../StyledComponents/Beam/Beam";
import type { BracketExampleProps, BracketFamilyExampleProps } from "./BracketPage.types";
import { BEAM_PATHS, NOTHING_PICKED, computeRouteSpan, toConnectorBoard } from "./BracketPageSolid.const";
import { FamilyExample } from "./Examples/Family";
import { KnockoutExample } from "./Examples/Knockout";
import { OrgChartExample } from "./Examples/OrgChart";
import { SkillTreeExample } from "./Examples/SkillTree";

const FamilyExampleWrapper = (props: Omit<BracketFamilyExampleProps, "isSnappingToFamily">) => {
    const [getIsSnapping, setIsSnapping] = createSignal(BracketKnobs.STARTING_IS_SNAPPING_TO_FAMILY);

    return (
        <>
            <FamilyExample {...props} isSnappingToFamily={getIsSnapping} />

            <PageExampleKnobs>
                <PageProp
                    key={"isSnappingToFamily"}
                    label={"Snap to family"}
                    hint={"Glides the window to frame the family in it once a drag, a pinch or the wheel is over."}
                    controls={"Sets BracketProps.isSnappingToFamily"}
                >
                    <PageCheckField value={getIsSnapping} ariaLabel={"Snap to family"} onChange={setIsSnapping} />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

export const BracketPage = () => {
    const [getLayerGap, setLayerGap] = createSignal(BRACKET_DEFAULTS.layerGap);
    const [getCrossGap, setCrossGap] = createSignal(BRACKET_DEFAULTS.crossGap);
    const [getOrientation, setOrientation] = createSignal<BracketOrientation>(BRACKET_DEFAULTS.orientation);
    const [getRootSide, setRootSide] = createSignal<BracketRootSide>(BRACKET_DEFAULTS.rootSide);
    const [getConnector, setConnector] = createSignal<BracketConnectors.SampleKey>(BracketConnectors.SAMPLE_KEYS[0]);
    const [getPicked, setPicked] = createSignal(NOTHING_PICKED);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(BRACKET_DEFAULTS.transitionDurationMs);
    const [getFamily, setFamily] = createSignal("");

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const [getIsBeamPlaying, setIsBeamPlaying] = createSignal(!getPrefersReducedMotion());
    const [getBeamLengths, setBeamLengths] = createSignal<
        Record<string, { board: string; childId: string; lengthPx: number }>
    >({});

    const setBeamLength = (defs: BracketConnectorDefs, lengthPx: number | undefined) =>
        setBeamLengths((lengths) => {
            const { [defs.id]: _previous, ...others } = lengths;

            return lengthPx === undefined
                ? others
                : { ...others, [defs.id]: { board: toConnectorBoard(defs), childId: defs.childId, lengthPx } };
        });

    const getRouteSpan = (defs: BracketConnectorDefs) =>
        computeRouteSpan(getBeamLengths(), toConnectorBoard(defs), defs.childId);

    const getExamples = createMemo(() => {
        const commonProps: BracketExampleProps = {
            layerGap: getLayerGap,
            crossGap: getCrossGap,
            orientation: getOrientation,
            rootSide: getRootSide,
            onActivate: (value, placement) => setPicked(`${value}, node ${placement.id} in layer ${placement.layer}`),
            renderConnector: (getDefs) => (
                <>
                    {BracketConnectors.SAMPLE_CONNECTORS[getConnector()]({
                        defs: getDefs(),
                        radius: CONNECTOR_RADIUS,
                        width: getDefs().isOnFocusedRoute ? ROUTE_CONNECTOR_WIDTH : CONNECTOR_WIDTH,
                        fromColor: getDefs().isOnFocusedRoute ? ROUTE_FROM_COLOR : CONNECTOR_FROM_COLOR,
                        toColor: getDefs().isOnFocusedRoute ? ROUTE_TO_COLOR : CONNECTOR_TO_COLOR,
                    })}

                    <Show when={getDefs().isOnFocusedRoute}>
                        <PageBeam
                            d={() => BEAM_PATHS[getConnector()](getDefs(), CONNECTOR_RADIUS)}
                            direction={() => "backward"}
                            isPlaying={getIsBeamPlaying}
                            routeStartPx={() => getRouteSpan(getDefs()).startPx}
                            routeLengthPx={() => getRouteSpan(getDefs()).totalPx}
                            onLengthPx={(lengthPx) => setBeamLength(getDefs(), lengthPx)}
                        />
                    </Show>
                </>
            ),
        };

        return [
            {
                key: "knockout",
                name: EXAMPLE_NAMES.knockout,
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
                name: EXAMPLE_NAMES.orgChart,
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
                name: EXAMPLE_NAMES.skillTree,
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
                name: EXAMPLE_NAMES.family,
                span: WIDE_SPAN,
                readout: () =>
                    `showing: ${getFamily()} — the whole draw stays mounted and a camera frames one family at a time: what the focused node feeds, it with all its siblings, and what feeds them; walk on with the arrows, or page through with the buttons without leaving them, and the camera pans and zooms to fit; Zoom out fits the whole draw, and Zoom in goes back to the family`,
                component: () => (
                    <FamilyExampleWrapper
                        {...commonProps}
                        transitionDurationMs={() =>
                            getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getTransitionDurationMs()
                        }
                        onFamilyChange={setFamily}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Family.tsx`,
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
                    controls={"Picks the sample connector drawn by BracketProps.renderConnector"}
                >
                    <PageSelectField
                        value={getConnector}
                        values={BracketConnectors.SAMPLE_KEYS}
                        ariaLabel={"Connectors"}
                        onChange={(connector) => setConnector(() => connector)}
                    />
                </PageProp>

                <PageProp
                    key={"isBeamPlaying"}
                    label={"Beams moving"}
                    hint={
                        "Whether the pulse runs along the lines between the focused node and the final. It starts stopped while the visitor has asked for reduced motion."
                    }
                    controls={"Plays the example beam drawn by BracketProps.renderConnector"}
                >
                    <PageCheckField value={getIsBeamPlaying} ariaLabel={"Beams moving"} onChange={setIsBeamPlaying} />
                </PageProp>

                <PageProp
                    key={"orientation"}
                    label={"Orientation"}
                    hint={"Whether the rounds run across the page or down it."}
                    controls={"Sets BracketProps.orientation"}
                >
                    <PageSelectField
                        value={getOrientation}
                        values={BRACKET_ORIENTATIONS}
                        ariaLabel={"Orientation"}
                        onChange={(orientation) => setOrientation(() => orientation)}
                    />
                </PageProp>

                <PageProp
                    key={"rootSide"}
                    label={"Root side"}
                    hint={"Which end the final holds, and so which way the rounds read."}
                    controls={"Sets BracketProps.rootSide"}
                >
                    <PageSelectField
                        value={getRootSide}
                        values={BRACKET_ROOT_SIDES}
                        ariaLabel={"Root side"}
                        onChange={(side) => setRootSide(() => side)}
                    />
                </PageProp>

                <PageProp
                    key={"layerGap"}
                    label={"Layer gap (px)"}
                    hint={"The space between one round and the next."}
                    controls={"Sets BracketProps.layerGap"}
                >
                    <PageNumberField
                        value={getLayerGap}
                        min={BracketKnobs.MIN_LAYER_GAP}
                        max={BracketKnobs.MAX_LAYER_GAP}
                        step={BracketKnobs.LAYER_GAP_STEP}
                        ariaLabel={"Layer gap in pixels"}
                        onInput={setLayerGap}
                    />
                </PageProp>

                <PageProp
                    key={"crossGap"}
                    label={"Row gap (px)"}
                    hint={"The space between two matches in the same round."}
                    controls={"Sets BracketProps.crossGap"}
                >
                    <PageNumberField
                        value={getCrossGap}
                        min={BracketKnobs.MIN_CROSS_GAP}
                        max={BracketKnobs.MAX_CROSS_GAP}
                        step={BracketKnobs.CROSS_GAP_STEP}
                        ariaLabel={"Row gap in pixels"}
                        onInput={setCrossGap}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Glide (ms)"}
                    hint={
                        "How long the family example takes to glide from one family to the next. It is off while the visitor has asked for reduced motion."
                    }
                    controls={"Sets BracketProps.transitionDurationMs"}
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={BracketKnobs.MIN_TRANSITION_DURATION_MS}
                        max={BracketKnobs.MAX_TRANSITION_DURATION_MS}
                        step={BracketKnobs.TRANSITION_DURATION_STEP_MS}
                        isDisabled={getPrefersReducedMotion}
                        ariaLabel={"Glide in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};

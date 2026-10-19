import { For, createEffect, createMemo, createSignal, untrack } from "solid-js";

import { BRACKET_DEFAULTS, Bracket, BracketUtils, Button, access } from "@thewaver/ss-components-solid";
import type { BracketNode, BracketStep, PanZoomView } from "@thewaver/ss-components-solid";
import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageExampleKnobs } from "../../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageCheckField } from "../../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { BracketFamilyExampleProps } from "../BracketPage.types";
import {
    branch,
    computeBracketCurrentLayerHeader,
    computeFamilySteps,
    describeFamily,
    renderBracketNode,
    seed,
} from "../BracketPageSolid.const";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

const LAYOUT = BracketUtils.computeLayout(DRAW);

type Props = BracketFamilyExampleProps;

export const FamilyExample = (props: Props) => {
    const [getFamily, setFamily] = createSignal<BracketNode<string>>();
    const [getIsSnapping, setIsSnapping] = createSignal(BracketKnobs.STARTING_IS_SNAPPING_TO_FAMILY);

    const getHeaderSize = () => (access(props.orientation) === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE);

    const getGeometryOpts = () => ({
        nodeSize: NODE_SIZE,
        layerGap: access(props.layerGap) ?? BRACKET_DEFAULTS.layerGap,
        crossGap: access(props.crossGap) ?? BRACKET_DEFAULTS.crossGap,
        orientation: access(props.orientation) ?? BRACKET_DEFAULTS.orientation,
        rootSide: access(props.rootSide) ?? BRACKET_DEFAULTS.rootSide,
        headerExtent: getHeaderSize(),
    });

    const getFrameSize = createMemo(
        () => BracketUtils.computeGeometry(BracketUtils.computeFamilyExtent(LAYOUT), getGeometryOpts()).boardSize,
    );

    const getTreeGeometry = createMemo(() => BracketUtils.computeGeometry(LAYOUT, getGeometryOpts()));

    const getAnchorId = () => BracketUtils.findNodeId(DRAW, LAYOUT, getFamily());

    const computeFamilyView = () =>
        BracketUtils.computeFamilyView(LAYOUT, getTreeGeometry(), getAnchorId(), BracketKnobs.FAMILY_MARGIN);

    const viewSignal = createSignal<PanZoomView>(untrack(computeFamilyView));

    const getIsZoomedIn = createMemo(
        () =>
            BracketUtils.computeFamilyInView(
                LAYOUT,
                getTreeGeometry(),
                viewSignal[0](),
                getFrameSize().height / getFrameSize().width,
                BracketKnobs.FAMILY_MARGIN,
            ) !== undefined,
    );

    const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, getFamily(), step);

    createEffect(() => props.onFamilyChange(describeFamily(DRAW.value, getFamily()?.value)));

    return (
        <div class={styles.familyStage}>
            <PageMeasureBox>
                <div
                    class={styles.familyFrame}
                    style={{ width: `${getFrameSize().width}px`, height: `${getFrameSize().height}px` }}
                >
                    <Bracket
                        root={DRAW}
                        nodeSize={NODE_SIZE}
                        family={[getFamily, setFamily]}
                        view={viewSignal}
                        isFollowingFamily={true}
                        isSnappingToFamily={getIsSnapping}
                        familyMargin={BracketKnobs.FAMILY_MARGIN}
                        transitionDurationMs={props.transitionDurationMs}
                        layerGap={props.layerGap}
                        crossGap={props.crossGap}
                        orientation={props.orientation}
                        rootSide={props.rootSide}
                        layerHeaderSize={getHeaderSize}
                        ariaLabel={"Knockout draw, one family at a time"}
                        onActivate={props.onActivate}
                        renderConnector={props.renderConnector}
                        renderNode={renderBracketNode}
                        renderLayerHeader={computeBracketCurrentLayerHeader(ROUND_NAMES)}
                    />
                </div>
            </PageMeasureBox>

            <div class={styles.familyControls}>
                <Button
                    id={"familyZoom"}
                    ariaLabel={() => (getIsZoomedIn() ? "Zoom out" : "Zoom in")}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent
                            flags={getFlags}
                            glyph={() => (getIsZoomedIn() ? CONTROL_GLYPHS.zoomOut : CONTROL_GLYPHS.zoomIn)}
                        />
                    )}
                    onClick={() => {
                        viewSignal[1](
                            getIsZoomedIn() ? BracketUtils.computeWholeView(getTreeGeometry()) : computeFamilyView(),
                        );
                    }}
                />

                <For each={computeFamilySteps(access(props.orientation))}>
                    {(entry) => (
                        <Button
                            id={`familyStep-${entry.step}`}
                            isDisabled={() => !getIsZoomedIn() || computeStep(entry.step) === getFamily()}
                            ariaLabel={entry.label}
                            renderContent={(getFlags) => (
                                <PageControlButtonContent flags={getFlags} glyph={entry.glyph} />
                            )}
                            onClick={() => {
                                setFamily(() => computeStep(entry.step));
                            }}
                        />
                    )}
                </For>
            </div>

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
        </div>
    );
};

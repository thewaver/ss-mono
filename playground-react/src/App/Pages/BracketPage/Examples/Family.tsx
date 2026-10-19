import { useEffect, useState } from "react";

import { Bracket, BracketUtils, Button } from "@thewaver/ss-components-react";
import type { BracketNode, BracketStep, PanZoomView } from "@thewaver/ss-components-react";
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
} from "../BracketPageReact.const";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;
const LAYER_HEADER = computeBracketCurrentLayerHeader(ROUND_NAMES);

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

const LAYOUT = BracketUtils.computeLayout(DRAW);

type Props = BracketFamilyExampleProps;

export const FamilyExample = (props: Props) => {
    const [family, setFamily] = useState<BracketNode<string>>();
    const [isSnapping, setIsSnapping] = useState(BracketKnobs.STARTING_IS_SNAPPING_TO_FAMILY);

    const headerSize = props.orientation === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE;

    const geometryOpts = {
        nodeSize: NODE_SIZE,
        layerGap: props.layerGap,
        crossGap: props.crossGap,
        orientation: props.orientation,
        rootSide: props.rootSide,
        headerExtent: headerSize,
    };

    const frameSize = BracketUtils.computeGeometry(BracketUtils.computeFamilyExtent(LAYOUT), geometryOpts).boardSize;

    const treeGeometry = BracketUtils.computeGeometry(LAYOUT, geometryOpts);

    const anchorId = BracketUtils.findNodeId(DRAW, LAYOUT, family);

    const computeFamilyView = () =>
        BracketUtils.computeFamilyView(LAYOUT, treeGeometry, anchorId, BracketKnobs.FAMILY_MARGIN);

    const [view, setView] = useState<PanZoomView>(computeFamilyView);

    const isZoomedIn =
        BracketUtils.computeFamilyInView(
            LAYOUT,
            treeGeometry,
            view,
            frameSize.height / frameSize.width,
            BracketKnobs.FAMILY_MARGIN,
        ) !== undefined;

    const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, family, step);

    useEffect(() => props.onFamilyChange(describeFamily(DRAW.value, family?.value)), [family]);

    return (
        <div className={styles.familyStage}>
            <PageMeasureBox>
                <div
                    className={styles.familyFrame}
                    style={{ width: `${frameSize.width}px`, height: `${frameSize.height}px` }}
                >
                    <Bracket
                        root={DRAW}
                        nodeSize={NODE_SIZE}
                        family={[family, setFamily]}
                        view={[view, setView]}
                        isFollowingFamily={true}
                        isSnappingToFamily={isSnapping}
                        familyMargin={BracketKnobs.FAMILY_MARGIN}
                        transitionDurationMs={props.transitionDurationMs}
                        layerGap={props.layerGap}
                        crossGap={props.crossGap}
                        orientation={props.orientation}
                        rootSide={props.rootSide}
                        layerHeaderSize={headerSize}
                        ariaLabel={"Knockout draw, one family at a time"}
                        onActivate={props.onActivate}
                        renderConnector={props.renderConnector}
                        renderNode={renderBracketNode}
                        renderLayerHeader={LAYER_HEADER}
                    />
                </div>
            </PageMeasureBox>

            <div className={styles.familyControls}>
                <Button
                    id={"familyZoom"}
                    ariaLabel={isZoomedIn ? "Zoom out" : "Zoom in"}
                    renderContent={(flags) => (
                        <PageControlButtonContent
                            flags={flags}
                            glyph={isZoomedIn ? CONTROL_GLYPHS.zoomOut : CONTROL_GLYPHS.zoomIn}
                        />
                    )}
                    onClick={() => {
                        setView(isZoomedIn ? BracketUtils.computeWholeView(treeGeometry) : computeFamilyView());
                    }}
                />

                {computeFamilySteps(props.orientation).map((entry) => (
                    <Button
                        key={entry.step}
                        id={`familyStep-${entry.step}`}
                        isDisabled={!isZoomedIn || computeStep(entry.step) === family}
                        ariaLabel={entry.label}
                        renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={entry.glyph} />}
                        onClick={() => {
                            setFamily(computeStep(entry.step));
                        }}
                    />
                ))}
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"isSnappingToFamily"}
                    label={"Snap to family"}
                    hint={"Glides the window to frame the family in it once a drag, a pinch or the wheel is over."}
                    controls={"Sets BracketProps.isSnappingToFamily"}
                >
                    <PageCheckField value={isSnapping} ariaLabel={"Snap to family"} onChange={setIsSnapping} />
                </PageProp>
            </PageExampleKnobs>
        </div>
    );
};

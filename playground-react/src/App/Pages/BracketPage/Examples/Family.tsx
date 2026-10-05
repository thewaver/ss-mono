import { useEffect, useState } from "react";

import { Bracket, BracketUtils, Button } from "@thewaver/ss-components-react";
import type { BracketNode, BracketStep } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    branch,
    computeBracketLayerHeader,
    computeFamilySteps,
    describeFamily,
    renderBracketNode,
    seed,
} from "../BracketPage.const";
import type { BracketFamilyExampleProps } from "../BracketPage.types";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;
const LAYER_HEADER = computeBracketLayerHeader(ROUND_NAMES);

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

type Props = BracketFamilyExampleProps;

export const FamilyExample = (props: Props) => {
    const [family, setFamily] = useState<BracketNode<string>>();

    const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, family, step);

    useEffect(() => props.onFamilyChange(describeFamily(DRAW.value, family?.value)), [family]);

    return (
        <div className={styles.familyStage}>
            <PageMeasureBox>
                <div className={styles.board}>
                    <Bracket
                        root={DRAW}
                        nodeSize={NODE_SIZE}
                        view={"family"}
                        family={[family, setFamily]}
                        transitionDurationMs={props.transitionDurationMs}
                        layerGap={props.layerGap}
                        crossGap={props.crossGap}
                        orientation={props.orientation}
                        rootSide={props.rootSide}
                        layerHeaderSize={props.orientation === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE}
                        ariaLabel={"Knockout draw, one family at a time"}
                        onActivate={props.onActivate}
                        renderConnector={props.renderConnector}
                        renderNode={renderBracketNode}
                        renderLayerHeader={LAYER_HEADER}
                    />
                </div>
            </PageMeasureBox>

            <div className={styles.familyControls}>
                {computeFamilySteps(props.orientation).map((entry) => (
                    <Button
                        key={entry.step}
                        id={`familyStep-${entry.step}`}
                        isDisabled={computeStep(entry.step) === family}
                        renderContent={(flags) => <PageButtonContent flags={flags}>{entry.label}</PageButtonContent>}
                        onClick={() => {
                            setFamily(computeStep(entry.step));
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

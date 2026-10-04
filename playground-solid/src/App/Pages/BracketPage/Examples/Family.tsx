import { Bracket, access } from "@thewaver/ss-components-solid";
import type { BracketNode } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import { branch, computeBracketLayerHeader, describeFamily, renderBracketNode, seed } from "../BracketPage.const";
import type { BracketFamilyExampleProps } from "../BracketPage.types";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

type Props = BracketFamilyExampleProps;

export const FamilyExample = (props: Props) => {
    return (
        <div class={styles.board}>
            <Bracket
                root={() => DRAW}
                nodeSize={() => NODE_SIZE}
                view={() => "family"}
                transitionDurationMs={props.transitionDurationMs}
                layerGap={props.layerGap}
                crossGap={props.crossGap}
                orientation={props.orientation}
                rootSide={props.rootSide}
                layerHeaderSize={() =>
                    access(props.orientation) === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE
                }
                ariaLabel={"Knockout draw, one family at a time"}
                onActivate={props.onActivate}
                onFamilyChange={(value) => props.onFamilyChange(describeFamily(DRAW.value, value))}
                renderConnector={props.renderConnector}
                renderNode={renderBracketNode}
                renderLayerHeader={computeBracketLayerHeader(ROUND_NAMES)}
            />
        </div>
    );
};

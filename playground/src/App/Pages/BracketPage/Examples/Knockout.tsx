import { Bracket } from "@thewaver/ss-components";
import type { BracketNode } from "@thewaver/ss-components";

import { branch, renderBracketNode, seed } from "../BracketPage.const";
import type { BracketExampleProps } from "../BracketPage.types";

import * as styles from "../BracketPage.css";

const NODE_SIZE = { width: 96, height: 34 };

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch(
        "Semi 2",
        branch("Quarter 3", seed("Eli"), seed("Fay")),
        branch("Quarter 4", seed("Gus"), { value: "Withdrawn", isDisabled: true }),
    ),
);

type Props = BracketExampleProps;

export const KnockoutExample = (props: Props) => {
    return (
        <div class={styles.board}>
            <Bracket
                root={() => DRAW}
                nodeSize={() => NODE_SIZE}
                layerGap={props.layerGap}
                crossGap={props.crossGap}
                orientation={props.orientation}
                rootSide={props.rootSide}
                ariaLabel={"Knockout draw"}
                onActivate={props.onActivate}
                renderConnector={props.renderConnector}
                renderNode={renderBracketNode}
            />
        </div>
    );
};

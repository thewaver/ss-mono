import { Bracket } from "@thewaver/ss-components";
import type { BracketNode } from "@thewaver/ss-components";

import { branch, renderBracketNode, seed } from "../BracketPage.const";
import type { BracketExampleProps } from "../BracketPage.types";

import * as styles from "../BracketPage.css";

const NODE_SIZE = { width: 88, height: 40 };

const COMPANY: BracketNode<string> = branch(
    "Founder",
    branch("Product", seed("Design"), seed("Research"), seed("Content")),
    branch("Engineering", branch("Platform", seed("Data"), seed("Infra")), seed("Clients")),
    seed("Finance"),
);

type Props = BracketExampleProps;

export const OrgChartExample = (props: Props) => {
    return (
        <div class={styles.board}>
            <Bracket
                root={() => COMPANY}
                nodeSize={() => NODE_SIZE}
                layerGap={props.layerGap}
                crossGap={props.crossGap}
                orientation={props.orientation}
                rootSide={props.rootSide}
                ariaLabel={"Who reports to whom"}
                onActivate={props.onActivate}
                renderConnector={props.renderConnector}
                renderNode={renderBracketNode}
            />
        </div>
    );
};

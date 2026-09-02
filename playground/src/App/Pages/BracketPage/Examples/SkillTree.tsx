import { Bracket } from "@thewaver/ss-components";
import type { BracketNode } from "@thewaver/ss-components";

import { branch, renderBracketNode, seed } from "../BracketPage.const";
import type { BracketExampleProps } from "../BracketPage.types";

import * as styles from "../BracketPage.css";

const NODE_SIZE = { width: 80, height: 36 };

const SKILLS: BracketNode<string> = branch(
    "Adept",
    branch("Fire", branch("Ember", seed("Spark"))),
    branch("Frost", seed("Chill"), { value: "Blizzard", isDisabled: true }),
);

type Props = BracketExampleProps;

export const SkillTreeExample = (props: Props) => {
    return (
        <div class={styles.board}>
            <Bracket
                root={() => SKILLS}
                nodeSize={() => NODE_SIZE}
                layerGap={props.layerGap}
                crossGap={props.crossGap}
                orientation={props.orientation}
                rootSide={props.rootSide}
                ariaLabel={"Skills and what they unlock"}
                onActivate={props.onActivate}
                renderConnector={props.renderConnector}
                renderNode={renderBracketNode}
            />
        </div>
    );
};

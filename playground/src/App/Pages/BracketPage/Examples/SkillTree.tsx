import { Bracket, access } from "@thewaver/ss-components";
import type { BracketNode } from "@thewaver/ss-components";

import { branch, computeBracketLayerHeader, renderBracketNode, seed } from "../BracketPage.const";
import type { BracketExampleProps } from "../BracketPage.types";

import * as styles from "../BracketPage.css";

const NODE_SIZE = { width: 80, height: 36 };
const TIER_NAMES = ["Tier 4", "Tier 3", "Tier 2", "Tier 1"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 56;

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
                layerHeaderSize={() =>
                    access(props.orientation) === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE
                }
                ariaLabel={"Skills and what they unlock"}
                onActivate={props.onActivate}
                renderConnector={props.renderConnector}
                renderNode={renderBracketNode}
                renderLayerHeader={computeBracketLayerHeader(TIER_NAMES)}
            />
        </div>
    );
};

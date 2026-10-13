import { SlotText } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextExampleProps } from "../SlotTextPageSolid.types";

const CHARACTER_SIZE = { width: 34, height: 52 };

type Props = SlotTextExampleProps;

export const SplitFlapExample = (props: Props) => {
    return (
        <SlotText
            text={props.text}
            mechanism={"split_flap"}
            characterSize={() => CHARACTER_SIZE}
            turnDurationMs={props.turnDurationMs}
            turnDelayMs={props.turnDelayMs}
            ariaLabel={"Departures"}
            renderTurning={(getDigit) => <div class={styles.flapTile}>{getDigit()}</div>}
            renderFixed={(getCharacter) => <div class={styles.fixed}>{getCharacter()}</div>}
        />
    );
};

import { SlotText } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextExampleProps } from "../SlotTextPage.types";

const CHARACTER_SIZE = { width: 34, height: 52 };

type Props = SlotTextExampleProps;

export const SplitFlapExample = (props: Props) => {
    return (
        <SlotText
            text={props.text}
            mechanism={"splitFlap"}
            characterSize={CHARACTER_SIZE}
            turnDurationMs={props.turnDurationMs}
            turnDelayMs={props.turnDelayMs}
            ariaLabel={"Departures"}
            renderTurning={(digit) => <div className={styles.flapTile}>{digit}</div>}
            renderFixed={(character) => <div className={styles.fixed}>{character}</div>}
        />
    );
};

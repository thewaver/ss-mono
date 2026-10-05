import { SlotText } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextExampleProps } from "../SlotTextPage.types";

const DIGIT_SIZE = { width: 40, height: 60 };

type Props = SlotTextExampleProps;

export const SplitFlapExample = (props: Props) => {
    return (
        <div className={styles.board}>
            <SlotText
                text={props.text}
                mechanism={"splitFlap"}
                characterSize={DIGIT_SIZE}
                turnDurationMs={props.turnDurationMs}
                turnDelayMs={props.turnDelayMs}
                ariaLabel={"Departures"}
                renderTurning={(digit) => <div className={styles.flapTile}>{digit}</div>}
                renderFixed={(character) => <div className={styles.flapFixed}>{character}</div>}
            />
        </div>
    );
};

import { Odometer } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

import type { OdometerExampleProps } from "../OdometerPage.types";

const DIGIT_SIZE = { width: 40, height: 60 };

type Props = OdometerExampleProps;

export const SplitFlapExample = (props: Props) => {
    return (
        <div className={styles.board}>
            <Odometer
                text={props.text}
                mechanism={"splitFlap"}
                digitSize={DIGIT_SIZE}
                turnDurationMs={props.turnDurationMs}
                cascadeDelayMs={props.cascadeDelayMs}
                ariaLabel={"Departures"}
                renderDigit={(digit) => <div className={styles.flapTile}>{digit}</div>}
                renderFixed={(character) => <div className={styles.flapFixed}>{character}</div>}
            />
        </div>
    );
};

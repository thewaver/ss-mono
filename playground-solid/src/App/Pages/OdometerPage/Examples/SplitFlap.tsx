import { Odometer } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

import type { OdometerExampleProps } from "../OdometerPage.types";

const DIGIT_SIZE = { width: 40, height: 60 };

type Props = OdometerExampleProps;

export const SplitFlapExample = (props: Props) => {
    return (
        <div class={styles.board}>
            <Odometer
                text={props.text}
                mechanism={"splitFlap"}
                digitSize={() => DIGIT_SIZE}
                turnDurationMs={props.turnDurationMs}
                cascadeDelayMs={props.cascadeDelayMs}
                ariaLabel={"Departures"}
                renderDigit={(getDigit) => <div class={styles.flapTile}>{getDigit()}</div>}
                renderFixed={(getCharacter) => <div class={styles.flapFixed}>{getCharacter()}</div>}
            />
        </div>
    );
};

import { Odometer } from "@thewaver/ss-components";

import type { OdometerExampleProps } from "../OdometerPage.types";

import * as styles from "../OdometerPage.css";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = OdometerExampleProps;

export const CounterExample = (props: Props) => {
    return (
        <Odometer
            text={props.text}
            digitSize={() => DIGIT_SIZE}
            turnDurationMs={props.turnDurationMs}
            cascadeDelayMs={props.cascadeDelayMs}
            ariaLabel={"Score"}
            renderDigit={(getDigit) => <div class={styles.digit}>{getDigit()}</div>}
            renderFixed={(getCharacter) => <span class={styles.fixed}>{getCharacter()}</span>}
        />
    );
};

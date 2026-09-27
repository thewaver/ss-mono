import { Odometer, OdometerReels, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/OdometerPage/OdometerPage.css";

import type { OdometerReelsExampleProps } from "../OdometerPage.types";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = OdometerReelsExampleProps;

export const ReelsExample = (props: Props) => {
    return (
        <Odometer
            text={props.text}
            digitSize={() => DIGIT_SIZE}
            ariaLabel={"Slot machine"}
            computeReel={(digitIndex, digitCount) =>
                OdometerReels.SAMPLE_REELS[access(props.reelKey)](digitIndex, digitCount)
            }
            renderDigit={(getDigit) => <div class={styles.digit}>{getDigit()}</div>}
        />
    );
};

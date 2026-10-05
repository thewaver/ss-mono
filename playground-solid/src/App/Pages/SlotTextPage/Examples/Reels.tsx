import { SlotText, SlotTextReels, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextReelsExampleProps } from "../SlotTextPage.types";

const DIGIT_SIZE = { width: 34, height: 52 };

type Props = SlotTextReelsExampleProps;

export const ReelsExample = (props: Props) => {
    return (
        <SlotText
            text={props.text}
            characterSize={() => DIGIT_SIZE}
            ariaLabel={"Slot machine"}
            computeReel={(digitIndex, digitCount) =>
                SlotTextReels.SAMPLE_REELS[access(props.reelKey)](digitIndex, digitCount)
            }
            renderTurning={(getDigit) => <div class={styles.digit}>{getDigit()}</div>}
        />
    );
};

import { SlotText, access } from "@thewaver/ss-components-solid";
import { WORD_LETTERS } from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";

import type { SlotTextWordsExampleProps } from "../SlotTextPage.types";

const CHARACTER_SIZE = { width: 34, height: 52 };

type Props = SlotTextWordsExampleProps;

export const WordsExample = (props: Props) => {
    const getTileClass = () => (access(props.mechanism) === "splitFlap" ? styles.flapTile : styles.digit);

    return (
        <SlotText
            text={props.text}
            letters={WORD_LETTERS}
            letterRoute={props.letterRoute}
            mechanism={props.mechanism}
            characterSize={() => CHARACTER_SIZE}
            turnDurationMs={props.turnDurationMs}
            turnDelayMs={props.turnDelayMs}
            ariaLabel={"Destination"}
            renderTurning={(getCharacter) => <div class={getTileClass()}>{getCharacter()}</div>}
        />
    );
};

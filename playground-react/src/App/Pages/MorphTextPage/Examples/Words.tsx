import { useEffect, useState } from "react";

import { Button, MorphText } from "@thewaver/ss-components-react";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";
import { MORPH_WORDS } from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { MorphTextExampleProps } from "../MorphTextPage.types";

type Props = MorphTextExampleProps;

export const WordsExample = (props: Props) => {
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(
            () => setIndex((current) => (current + 1) % MORPH_WORDS.length),
            MorphTextKnobs.CYCLE_MS,
        );

        return () => clearInterval(interval);
    }, [isPlaying]);

    const onWordChange = props.onWordChange;

    useEffect(() => onWordChange(MORPH_WORDS[index]), [index, onWordChange]);

    return (
        <div className={styles.stage}>
            <div className={styles.word}>
                <MorphText
                    text={MORPH_WORDS[index]}
                    morphDurationMs={props.morphDurationMs}
                    maxBlurPx={props.maxBlurPx}
                />
            </div>

            <Button
                id={"morphWordsPlayback"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>{isPlaying ? "Pause" : "Play"}</PageButtonContent>
                )}
                onClick={() => setIsPlaying((playing) => !playing)}
            />
        </div>
    );
};

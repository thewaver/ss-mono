import { createEffect, createSignal, onCleanup } from "solid-js";

import { Button, MorphText } from "@thewaver/ss-components-solid";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";
import { MORPH_WORDS } from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { MorphTextExampleProps } from "../MorphTextPage.types";

type Props = MorphTextExampleProps;

export const WordsExample = (props: Props) => {
    const [getIndex, setIndex] = createSignal(0);
    const [getIsPlaying, setIsPlaying] = createSignal(true);

    createEffect(() => {
        if (!getIsPlaying()) return;

        const interval = setInterval(
            () => setIndex((index) => (index + 1) % MORPH_WORDS.length),
            MorphTextKnobs.CYCLE_MS,
        );

        onCleanup(() => clearInterval(interval));
    });

    createEffect(() => props.onWordChange(MORPH_WORDS[getIndex()]));

    return (
        <div class={styles.stage}>
            <div class={styles.word}>
                <MorphText
                    text={() => MORPH_WORDS[getIndex()]}
                    morphDurationMs={props.morphDurationMs}
                    maxBlurPx={props.maxBlurPx}
                />
            </div>

            <Button
                id={"morphWordsPlayback"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>{getIsPlaying() ? "Pause" : "Play"}</PageButtonContent>
                )}
                onClick={() => {
                    setIsPlaying((isPlaying) => !isPlaying);
                }}
            />
        </div>
    );
};

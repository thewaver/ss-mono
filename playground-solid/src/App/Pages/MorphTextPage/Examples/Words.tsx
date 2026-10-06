import { createEffect, createSignal, onCleanup } from "solid-js";

import { Button, MorphText } from "@thewaver/ss-components-solid";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";
import { MORPH_WORDS } from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
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
                ariaLabel={() => (getIsPlaying() ? "Pause" : "Play")}
                renderContent={(getFlags) => (
                    <PageControlButtonContent
                        flags={getFlags}
                        glyph={() => (getIsPlaying() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                    />
                )}
                onClick={() => {
                    setIsPlaying((isPlaying) => !isPlaying);
                }}
            />
        </div>
    );
};

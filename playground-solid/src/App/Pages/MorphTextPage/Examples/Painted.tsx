import { createEffect, createSignal, createUniqueId, onCleanup } from "solid-js";

import { Button, MorphText, PaintedText, SVGDefsSamples } from "@thewaver/ss-components-solid";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";
import {
    MORPH_PAINT,
    MORPH_PAINT_TIMING,
    PAINTED_WORDS,
} from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { computePaintDefs } from "../../../PageComponents/PaintPicker/PaintPicker.const";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { MorphTextExampleProps } from "../MorphTextPage.types";

const PAINT_SETTINGS = { colors: SVGDefsSamples.SAMPLE_COLORS, ...MORPH_PAINT_TIMING };

type Props = MorphTextExampleProps;

export const PaintedExample = (props: Props) => {
    const [getIndex, setIndex] = createSignal(0);
    const [getIsPlaying, setIsPlaying] = createSignal(true);

    createEffect(() => {
        if (!getIsPlaying()) return;

        const interval = setInterval(
            () => setIndex((index) => (index + 1) % PAINTED_WORDS.length),
            MorphTextKnobs.CYCLE_MS,
        );

        onCleanup(() => clearInterval(interval));
    });

    createEffect(() => props.onWordChange(PAINTED_WORDS[getIndex()]));

    return (
        <div class={styles.stage}>
            <div class={styles.paintedWord}>
                <MorphText
                    text={() => PAINTED_WORDS[getIndex()]}
                    morphDurationMs={props.morphDurationMs}
                    maxBlurPx={props.maxBlurPx}
                    renderText={(getText) => {
                        const id = createUniqueId();

                        return (
                            <PaintedText
                                computeFillDefs={(getSize, getRef) =>
                                    computePaintDefs(MORPH_PAINT, PAINT_SETTINGS, "fill", `fill-${id}`, getSize, getRef)
                                }
                            >
                                {getText()}
                            </PaintedText>
                        );
                    }}
                />
            </div>

            <Button
                id={"morphPaintedPlayback"}
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

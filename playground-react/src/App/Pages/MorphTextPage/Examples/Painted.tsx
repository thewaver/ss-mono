import { useEffect, useId, useState } from "react";

import { Button, MorphText, PaintedText, SVGDefsSamples } from "@thewaver/ss-components-react";
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
    const id = useId();
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(
            () => setIndex((current) => (current + 1) % PAINTED_WORDS.length),
            MorphTextKnobs.CYCLE_MS,
        );

        return () => clearInterval(interval);
    }, [isPlaying]);

    const onWordChange = props.onWordChange;

    useEffect(() => onWordChange(PAINTED_WORDS[index]), [index, onWordChange]);

    return (
        <div className={styles.stage}>
            <div className={styles.paintedWord}>
                <MorphText
                    text={PAINTED_WORDS[index]}
                    morphDurationMs={props.morphDurationMs}
                    maxBlurPx={props.maxBlurPx}
                    renderText={(text) => (
                        <PaintedText
                            computeFillDefs={(size, element) =>
                                computePaintDefs(
                                    MORPH_PAINT,
                                    PAINT_SETTINGS,
                                    "fill",
                                    `fill-${id}-${text}`,
                                    size,
                                    element,
                                )
                            }
                        >
                            {text}
                        </PaintedText>
                    )}
                />
            </div>

            <Button
                id={"morphPaintedPlayback"}
                ariaLabel={isPlaying ? "Pause" : "Play"}
                renderContent={(flags) => (
                    <PageControlButtonContent
                        flags={flags}
                        glyph={isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                    />
                )}
                onClick={() => setIsPlaying((playing) => !playing)}
            />
        </div>
    );
};

import { useState } from "react";

import { Button, Range, Typewriter } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { TypewriterKaraokeExampleProps } from "../TypewriterPage.types";

const LYRIC = "Twinkle, twinkle, little star";
const PERCENT = 100;
const SLIDER_STEP = 1;
const SLIDER_LENGTH = 110;
const CHARACTER_DELAY_MS = 120;
const CHARACTER_DURATION_MS = 600;
const RUN_START = 0;
const RUN_END = 1;

type Props = TypewriterKaraokeExampleProps;

export const KaraokeExample = (props: Props) => {
    const [progress, setProgress] = useState(RUN_START);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlaying = () => {
        if (!isPlaying && progress >= RUN_END) setProgress(RUN_START);

        setIsPlaying(!isPlaying);
    };

    return (
        <div className={styles.karaokeStack}>
            <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
                <div className={styles.karaokeLine}>
                    <Typewriter
                        progress={[progress, setProgress]}
                        playback={[isPlaying, setIsPlaying]}
                        computeAnimationName={() => styles.typewriterSweep}
                        animationDelayMs={CHARACTER_DELAY_MS}
                        animationDurationMs={CHARACTER_DURATION_MS}
                        onAnimationEnd={() => setIsPlaying(false)}
                    >
                        {LYRIC}
                    </Typewriter>
                </div>
            </PageMeasureBox>

            <div className={styles.karaokeControls}>
                <Button
                    id={"karaokePlay"}
                    ariaLabel={isPlaying ? "Pause" : "Sing"}
                    renderContent={(flags) => (
                        <PageControlButtonContent
                            flags={flags}
                            glyph={isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                        />
                    )}
                    onClick={togglePlaying}
                />

                <Range
                    id={"karaokeScrubber"}
                    sizing={"fill"}
                    ariaLabel={"How far the line has been sung"}
                    min={0}
                    max={PERCENT}
                    step={SLIDER_STEP}
                    value={[Math.round(progress * PERCENT), (value: number) => setProgress(value / PERCENT)]}
                    renderContent={(renderProps) => (
                        <PageRangeContent renderProps={renderProps} length={SLIDER_LENGTH} />
                    )}
                />
            </div>
        </div>
    );
};

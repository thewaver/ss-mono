import { createSignal } from "solid-js";

import { Button, Range, Typewriter } from "@thewaver/ss-components-solid";
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
    const [getProgress, setProgress] = createSignal(RUN_START);
    const [getIsPlaying, setIsPlaying] = createSignal(false);

    const togglePlaying = () => {
        if (!getIsPlaying() && getProgress() >= RUN_END) setProgress(RUN_START);

        setIsPlaying((isPlaying) => !isPlaying);
    };

    return (
        <div class={styles.karaokeStack}>
            <PageMeasureBox width={props.width} padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.karaokeLine}>
                    <Typewriter
                        progress={[getProgress, setProgress]}
                        playback={[getIsPlaying, setIsPlaying]}
                        computeAnimationName={() => styles.typewriterSweep}
                        animationDelayMs={() => CHARACTER_DELAY_MS}
                        animationDurationMs={() => CHARACTER_DURATION_MS}
                        onAnimationEnd={() => setIsPlaying(false)}
                    >
                        {LYRIC}
                    </Typewriter>
                </div>
            </PageMeasureBox>

            <div class={styles.karaokeControls}>
                <Button
                    id={"karaokePlay"}
                    ariaLabel={() => (getIsPlaying() ? "Pause" : "Sing")}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent
                            flags={getFlags}
                            glyph={() => (getIsPlaying() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                        />
                    )}
                    onClick={togglePlaying}
                />

                <Range
                    id={"karaokeScrubber"}
                    sizing={"fill"}
                    ariaLabel={"How far the line has been sung"}
                    min={() => 0}
                    max={() => PERCENT}
                    step={() => SLIDER_STEP}
                    value={[() => Math.round(getProgress() * PERCENT), (value: number) => setProgress(value / PERCENT)]}
                    renderContent={(getRenderProps) => (
                        <PageRangeContent renderProps={getRenderProps} length={() => SLIDER_LENGTH} />
                    )}
                />
            </div>
        </div>
    );
};

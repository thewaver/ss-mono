import { useState } from "react";

import { Button, Range, Typewriter } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";

const LYRIC = "Twinkle, twinkle, little star";
const PERCENT = 100;
const SLIDER_STEP = 1;
const SLIDER_LENGTH = 110;
const CHARACTER_DELAY_MS = 120;
const CHARACTER_DURATION_MS = 600;
const RUN_START = 0;
const RUN_END = 1;

export const KaraokeExample = () => {
    const [progress, setProgress] = useState(RUN_START);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlaying = () => {
        if (!isPlaying && progress >= RUN_END) setProgress(RUN_START);

        setIsPlaying(!isPlaying);
    };

    return (
        <div className={styles.karaokeStack}>
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

            <div className={styles.karaokeControls}>
                <Button
                    id={"karaokePlay"}
                    renderContent={(flags) => (
                        <PageButtonContent flags={flags}>{isPlaying ? "Pause" : "Sing"}</PageButtonContent>
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

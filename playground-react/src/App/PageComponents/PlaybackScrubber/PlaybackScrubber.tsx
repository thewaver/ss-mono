import { useRef } from "react";

import { Button, ElementObserverReactUtils, Range } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageRangeContent } from "../../StyledComponents/RangeContent/RangeContent";
import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";

const PERCENT = 100;
const SLIDER_STEP = 1;

export const PagePlaybackScrubber = (props: PagePlaybackScrubberProps) => {
    const sliderSlotRef = useRef<HTMLDivElement>(null);

    const sliderSlotSize = ElementObserverReactUtils.useBorderBoxSize(sliderSlotRef);

    const [isPlaying, setIsPlaying] = props.playback;
    const [progress, setProgress] = props.progress;

    return (
        <div className={styles.playbackRow}>
            <Button
                id={`${props.id}Playback`}
                ariaLabel={isPlaying ? "Pause" : "Play"}
                renderContent={(flags) => (
                    <PageControlButtonContent
                        flags={flags}
                        glyph={isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                    />
                )}
                onClick={() => {
                    setIsPlaying(!isPlaying);
                }}
            />

            <div ref={sliderSlotRef} className={styles.sliderSlot}>
                <Range
                    id={`${props.id}Progress`}
                    sizing={"fill"}
                    ariaLabel={props.ariaLabel}
                    min={0}
                    max={PERCENT}
                    step={SLIDER_STEP}
                    value={[Math.round(progress * PERCENT), (value: number) => setProgress(value / PERCENT)]}
                    renderContent={(renderProps) => (
                        <PageRangeContent renderProps={renderProps} length={sliderSlotSize.width} />
                    )}
                />
            </div>
        </div>
    );
};

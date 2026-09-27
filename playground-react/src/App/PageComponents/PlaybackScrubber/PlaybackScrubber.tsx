import { useRef } from "react";

import { Button, ElementObserverReactUtils, Range } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/PageComponents/PlaybackScrubber/PlaybackScrubber.css";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageRangeContent } from "../../StyledComponents/RangeContent/RangeContent";
import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";

const PERCENT = 100;
const SLIDER_STEP = 1;
const PLAY_ICON_PATH = "M7 4 L20 12 L7 20 Z";
const PAUSE_ICON_PATH = "M6 4 H10 V20 H6 Z M14 4 H18 V20 H14 Z";

export const PagePlaybackScrubber = (props: PagePlaybackScrubberProps) => {
    const sliderSlotRef = useRef<HTMLDivElement>(null);

    const sliderSlotSize = ElementObserverReactUtils.useBorderBoxSize(sliderSlotRef);

    const [isPlaying, setIsPlaying] = props.playbackState;
    const [progress, setProgress] = props.progressState;

    return (
        <div className={styles.playbackRow}>
            <Button
                id={`${props.id}Playback`}
                ariaLabel={isPlaying ? "Pause" : "Play"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>
                        <svg className={styles.playbackIcon} viewBox="0 0 24 24" aria-hidden="true">
                            <path d={isPlaying ? PAUSE_ICON_PATH : PLAY_ICON_PATH} />
                        </svg>
                    </PageButtonContent>
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
                    valueState={[Math.round(progress * PERCENT), (value: number) => setProgress(value / PERCENT)]}
                    renderContent={(renderProps) => (
                        <PageRangeContent renderProps={renderProps} length={sliderSlotSize.width} />
                    )}
                />
            </div>
        </div>
    );
};

import { createSignal } from "solid-js";

import { Button, ElementObserverUtils, Range } from "@thewaver/ss-components";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageRangeContent } from "../../StyledComponents/RangeContent/RangeContent";
import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";

import * as styles from "./PlaybackScrubber.css";

const PERCENT = 100;
const SLIDER_STEP = 1;
const PLAY_ICON_PATH = "M7 4 L20 12 L7 20 Z";
const PAUSE_ICON_PATH = "M6 4 H10 V20 H6 Z M14 4 H18 V20 H14 Z";

export const PagePlaybackScrubber = (props: PagePlaybackScrubberProps) => {
    const [getSliderSlotRef, setSliderSlotRef] = createSignal<HTMLElement>();

    const getSliderSlotSize = ElementObserverUtils.createBorderBoxSizeObserver(getSliderSlotRef);

    return (
        <div class={styles.playbackRow}>
            <Button
                id={`${props.id}Playback`}
                ariaLabel={() => (props.playbackSignal[0]() ? "Pause" : "Play")}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>
                        <svg class={styles.playbackIcon} viewBox="0 0 24 24" aria-hidden="true">
                            <path d={props.playbackSignal[0]() ? PAUSE_ICON_PATH : PLAY_ICON_PATH} />
                        </svg>
                    </PageButtonContent>
                )}
                onClick={() => {
                    props.playbackSignal[1]((isPlaying) => !isPlaying);
                }}
            />

            <div ref={setSliderSlotRef} class={styles.sliderSlot}>
                <Range
                    id={`${props.id}Progress`}
                    sizing={"fill"}
                    ariaLabel={props.ariaLabel}
                    min={() => 0}
                    max={() => PERCENT}
                    step={() => SLIDER_STEP}
                    valueSignal={[
                        () => Math.round(props.progressSignal[0]() * PERCENT),
                        (value: number) => props.progressSignal[1](value / PERCENT),
                    ]}
                    renderContent={(getRenderProps) => (
                        <PageRangeContent renderProps={getRenderProps} length={() => getSliderSlotSize().width} />
                    )}
                />
            </div>
        </div>
    );
};

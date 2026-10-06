import { createSignal } from "solid-js";

import { Button, ElementObserverSolidUtils, Range } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/PlaybackScrubber/PlaybackScrubber.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageRangeContent } from "../../StyledComponents/RangeContent/RangeContent";
import type { PagePlaybackScrubberProps } from "./PlaybackScrubber.types";

const PERCENT = 100;
const SLIDER_STEP = 1;

export const PagePlaybackScrubber = (props: PagePlaybackScrubberProps) => {
    const [getSliderSlotRef, setSliderSlotRef] = createSignal<HTMLElement>();

    const getSliderSlotSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getSliderSlotRef);

    return (
        <div class={styles.playbackRow}>
            <Button
                id={`${props.id}Playback`}
                ariaLabel={() => (props.playback[0]() ? "Pause" : "Play")}
                renderContent={(getFlags) => (
                    <PageControlButtonContent
                        flags={getFlags}
                        glyph={() => (props.playback[0]() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                    />
                )}
                onClick={() => {
                    props.playback[1]((isPlaying) => !isPlaying);
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
                    value={[
                        () => Math.round(props.progress[0]() * PERCENT),
                        (value: number) => props.progress[1](value / PERCENT),
                    ]}
                    renderContent={(getRenderProps) => (
                        <PageRangeContent renderProps={getRenderProps} length={() => getSliderSlotSize().width} />
                    )}
                />
            </div>
        </div>
    );
};

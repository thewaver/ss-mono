import { For } from "solid-js";

import { Button, Wraparound } from "@thewaver/ss-components-solid";
import { MARQUEE_WORDS } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { WraparoundMarqueeExampleProps } from "../WraparoundPage.types";

type Props = WraparoundMarqueeExampleProps;

export const MarqueeExample = (props: Props) => (
    <div class={styles.marqueeStack}>
        <div class={styles.marqueeStage}>
            <Wraparound
                ariaLabel={"Tools this library is built with, drifting past"}
                isMovable={false}
                driftPxPerSecond={props.driftPxPerSecond}
                driftDegrees={props.driftDegrees}
                playback={props.playback}
                renderContent={() => (
                    <div class={styles.marqueeTile}>
                        <For each={MARQUEE_WORDS}>{(word) => <span class={styles.marqueeWord}>{word}</span>}</For>
                    </div>
                )}
            />
        </div>

        <Button
            id={"marqueePlayback"}
            ariaLabel={() => (props.playback[0]() ? "Pause" : "Play")}
            renderContent={(getFlags) => (
                <PageControlButtonContent
                    flags={getFlags}
                    glyph={() => (props.playback[0]() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                />
            )}
            onClick={() => {
                props.playback[1](!props.playback[0]());
            }}
        />
    </div>
);

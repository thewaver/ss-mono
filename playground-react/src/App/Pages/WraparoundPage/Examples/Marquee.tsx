import { Button, Wraparound } from "@thewaver/ss-components-react";
import { MARQUEE_WORDS } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { WraparoundMarqueeExampleProps } from "../WraparoundPage.types";

type Props = WraparoundMarqueeExampleProps;

export const MarqueeExample = (props: Props) => (
    <div className={styles.marqueeStack}>
        <div className={styles.marqueeStage}>
            <Wraparound
                ariaLabel={"Tools this library is built with, drifting past"}
                isMovable={false}
                driftPxPerSecond={props.driftPxPerSecond}
                driftDegrees={props.driftDegrees}
                playback={props.playback}
                renderContent={() => (
                    <div className={styles.marqueeTile}>
                        {MARQUEE_WORDS.map((word) => (
                            <span key={word} className={styles.marqueeWord}>
                                {word}
                            </span>
                        ))}
                    </div>
                )}
            />
        </div>

        <Button
            id={"marqueePlayback"}
            renderContent={(flags) => (
                <PageButtonContent flags={flags}>{props.playback[0] ? "Pause" : "Play"}</PageButtonContent>
            )}
            onClick={() => {
                props.playback[1](!props.playback[0]);
            }}
        />
    </div>
);

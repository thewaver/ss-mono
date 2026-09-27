import { useState } from "react";

import { AudioSwitcher, Button } from "@thewaver/ss-components-react";
import type { AudioSwitcherController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { AudioSwitcherExampleProps } from "../AudioSwitcherPage.types";

type Props = AudioSwitcherExampleProps;

export const DefaultExample = (props: Props) => {
    const [controller, setController] = useState<AudioSwitcherController>();

    const [isPlaying, setIsPlaying] = props.playbackState;

    return (
        <div className={styles.deck}>
            <div className={styles.row}>
                <Button
                    renderContent={(flags) => (
                        <PageButtonContent flags={flags}>{isPlaying ? "Stop" : "Play"}</PageButtonContent>
                    )}
                    onClick={() => {
                        setIsPlaying(!isPlaying);
                    }}
                />

                <Button
                    isDisabled={!isPlaying}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Start over</PageButtonContent>}
                    onClick={() => {
                        controller?.reset();
                    }}
                />
            </div>

            <AudioSwitcher
                src={props.src}
                crossfadeMs={props.crossfadeMs}
                volume={props.volume}
                playbackState={props.playbackState}
                onMount={setController}
            />
        </div>
    );
};

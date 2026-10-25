import { useState } from "react";

import { AudioSwitcher, Button } from "@thewaver/ss-components-react";
import type { AudioSwitcherController } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { AudioSwitcherBasicDocsExampleProps } from "../AudioSwitcherPageReact.types";

type Props = AudioSwitcherBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [controller, setController] = useState<AudioSwitcherController>();
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className={styles.deck}>
            <div className={styles.row}>
                <Button
                    id={"playPause"}
                    ariaLabel={isPlaying ? "Pause" : "Play"}
                    renderContent={(flags) => (
                        <PageControlButtonContent
                            flags={flags}
                            glyph={isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                        />
                    )}
                    onClick={() => {
                        setIsPlaying((wasPlaying) => !wasPlaying);
                    }}
                />

                <Button
                    id={"startOver"}
                    isDisabled={!isPlaying}
                    ariaLabel={"Start over"}
                    renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS.replay} />}
                    onClick={() => {
                        controller?.reset();
                    }}
                />
            </div>

            <AudioSwitcher
                src={props.src}
                crossfadeMs={props.crossfadeMs}
                volume={props.volume}
                playback={[isPlaying, setIsPlaying]}
                onMount={setController}
            />
        </div>
    );
};

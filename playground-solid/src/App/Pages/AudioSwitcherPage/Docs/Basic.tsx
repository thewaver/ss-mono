import { createSignal } from "solid-js";

import { AudioSwitcher, Button } from "@thewaver/ss-components-solid";
import type { AudioSwitcherController } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { AudioSwitcherBasicDocsExampleProps } from "../AudioSwitcherPageSolid.types";

type Props = AudioSwitcherBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getController, setController] = createSignal<AudioSwitcherController>();
    const [getIsPlaying, setIsPlaying] = createSignal(false);

    return (
        <div class={styles.deck}>
            <div class={styles.row}>
                <Button
                    id={"playPause"}
                    ariaLabel={() => (getIsPlaying() ? "Pause" : "Play")}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent
                            flags={getFlags}
                            glyph={() => (getIsPlaying() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                        />
                    )}
                    onClick={() => {
                        setIsPlaying((isPlaying) => !isPlaying);
                    }}
                />

                <Button
                    id={"startOver"}
                    isDisabled={() => !getIsPlaying()}
                    ariaLabel={"Start over"}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.replay} />
                    )}
                    onClick={() => {
                        getController()?.reset();
                    }}
                />
            </div>

            <AudioSwitcher
                src={props.src}
                crossfadeMs={props.crossfadeMs}
                volume={props.volume}
                playback={[getIsPlaying, setIsPlaying]}
                onMount={setController}
            />
        </div>
    );
};

import { createSignal } from "solid-js";

import { AudioSwitcher, Button, access } from "@thewaver/ss-components-solid";
import type { AudioSwitcherController } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { AudioSwitcherExampleProps } from "../AudioSwitcherPage.types";

type Props = AudioSwitcherExampleProps;

export const DefaultExample = (props: Props) => {
    const [getController, setController] = createSignal<AudioSwitcherController>();

    const getIsPlaying = () => access(props.playback)[0]();

    const setIsPlaying = (isPlaying: boolean) => access(props.playback)[1](isPlaying);

    return (
        <div class={styles.deck}>
            <div class={styles.row}>
                <Button
                    ariaLabel={() => (getIsPlaying() ? "Stop" : "Play")}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent
                            flags={getFlags}
                            glyph={() => (getIsPlaying() ? CONTROL_GLYPHS.stop : CONTROL_GLYPHS.play)}
                        />
                    )}
                    onClick={() => {
                        setIsPlaying(!getIsPlaying());
                    }}
                />

                <Button
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
                playback={access(props.playback)}
                onMount={setController}
            />
        </div>
    );
};

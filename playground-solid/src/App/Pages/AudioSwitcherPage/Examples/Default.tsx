import { createSignal } from "solid-js";

import { AudioSwitcher, Button, access } from "@thewaver/ss-components-solid";
import type { AudioSwitcherController } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/AudioSwitcherPage/AudioSwitcherPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
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
                    renderContent={(getFlags) => (
                        <PageButtonContent flags={getFlags}>{getIsPlaying() ? "Stop" : "Play"}</PageButtonContent>
                    )}
                    onClick={() => {
                        setIsPlaying(!getIsPlaying());
                    }}
                />

                <Button
                    isDisabled={() => !getIsPlaying()}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Start over</PageButtonContent>}
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

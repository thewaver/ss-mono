import { createSignal } from "solid-js";

import { Button, ScrambleText, access } from "@thewaver/ss-components";
import type { ScrambleTextController } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

import * as styles from "../ScrambleTextPage.css";

const LINE = "DECRYPTING PAYLOAD FROM THE ARCHIVE";
const SINGLE_CHARACTER = 1;
const ROLLS_PER_CHARACTER = 6;
const RUN_MULTIPLIER = 4;
const MIN_INTERVAL_MS = 12;

type Props = ScrambleTextExampleProps;

export const SequentialExample = (props: Props) => {
    const [getController, setController] = createSignal<ScrambleTextController>();

    const getRunDurationMs = () => access(props.settleDurationMs) * RUN_MULTIPLIER;

    const getChurnDurationMs = () => getRunDurationMs() / Math.max(LINE.length - SINGLE_CHARACTER, SINGLE_CHARACTER);

    const getScrambleIntervalMs = () => Math.max(getChurnDurationMs() / ROLLS_PER_CHARACTER, MIN_INTERVAL_MS);

    return (
        <div class={styles.stack}>
            <div class={styles.headline}>
                <ScrambleText
                    text={LINE}
                    glyphs={props.glyphs}
                    settleDurationMs={getRunDurationMs}
                    churnDurationMs={getChurnDurationMs}
                    scrambleIntervalMs={getScrambleIntervalMs}
                    onMount={setController}
                />
            </div>

            <Button
                id={"revealAgain"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reveal again</PageButtonContent>}
                onClick={() => {
                    getController()?.restartAnimation();
                }}
            />
        </div>
    );
};

import { createSignal } from "solid-js";

import { Button, ScrambleText } from "@thewaver/ss-components";
import type { ScrambleTextController } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

import * as styles from "../ScrambleTextPage.css";

const HEADLINE = "SYSTEM ONLINE";

type Props = ScrambleTextExampleProps;

export const HeadlineExample = (props: Props) => {
    const [getController, setController] = createSignal<ScrambleTextController>();

    return (
        <div class={styles.stack}>
            <div class={styles.headline}>
                <ScrambleText
                    text={HEADLINE}
                    glyphs={props.glyphs}
                    settleDurationMs={props.settleDurationMs}
                    scrambleIntervalMs={props.scrambleIntervalMs}
                    computeCharacterWeights={props.computeCharacterWeights}
                    onMount={setController}
                />
            </div>

            <Button
                id={"runItAgain"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Run it again</PageButtonContent>}
                onClick={() => {
                    getController()?.restartAnimation();
                }}
            />
        </div>
    );
};

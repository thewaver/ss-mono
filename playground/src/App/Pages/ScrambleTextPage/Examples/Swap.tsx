import { createSignal } from "solid-js";

import { Button, ScrambleText } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

import * as styles from "../ScrambleTextPage.css";

const STATUSES = ["CONNECTING", "HANDSHAKE", "AUTHORISED", "STREAMING", "IDLE"];
const FIRST_STATUS = 0;

type Props = ScrambleTextExampleProps;

export const SwapExample = (props: Props) => {
    const [getStatusIndex, setStatusIndex] = createSignal(FIRST_STATUS);

    return (
        <div class={styles.stack}>
            <div class={styles.headline}>
                <ScrambleText
                    text={() => STATUSES[getStatusIndex()]}
                    glyphs={props.glyphs}
                    settleDurationMs={props.settleDurationMs}
                    scrambleIntervalMs={props.scrambleIntervalMs}
                    computeCharacterWeights={props.computeCharacterWeights}
                />
            </div>

            <Button
                id={"nextStatus"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Next status</PageButtonContent>}
                onClick={() => {
                    setStatusIndex((index) => (index + 1) % STATUSES.length);
                }}
            />
        </div>
    );
};

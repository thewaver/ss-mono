import { Reveal } from "@thewaver/ss-components";

import type { RevealExampleProps } from "../RevealPage.types";

import * as styles from "../RevealPage.css";

type Props = RevealExampleProps;

export const PromptExample = (props: Props) => {
    return (
        <div class={styles.root}>
            <Reveal
                radius={props.radius}
                roundness={props.roundness}
                softness={props.softness}
                isDisabled={props.isDisabled}
                renderContent={() => (
                    <div class={styles.content}>
                        <span class={styles.contentTitle}>The cover knows</span>
                        <span>It is handed whether a reveal is happening, so it can say something different.</span>
                    </div>
                )}
                renderCover={(getIsRevealing) => (
                    <div class={styles.promptCover}>{getIsRevealing() ? "found it" : "nothing to see here"}</div>
                )}
            />
        </div>
    );
};

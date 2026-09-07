import { Reveal } from "@thewaver/ss-components";

import type { RevealExampleProps } from "../RevealPage.types";

import * as styles from "../RevealPage.css";

type Props = RevealExampleProps;

export const PromptExample = (props: Props) => {
    return (
        <div class={styles.root}>
            <Reveal
                radius={props.radius}
                softness={props.softness}
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                isDisabled={props.isDisabled}
                computePoints={props.computePoints()}
                renderContent={() => (
                    <div class={styles.content}>
                        <span class={styles.contentTitle}>The cover knows</span>
                        <span>It is handed whether a reveal is happening, so it can say something different.</span>
                    </div>
                )}
                renderCover={(getIsRevealing, getMaskStyle) => (
                    <div class={styles.promptCover} style={getMaskStyle()}>
                        {getIsRevealing() ? "found it" : "nothing to see here"}
                    </div>
                )}
            />
        </div>
    );
};

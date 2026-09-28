import { Reveal } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.css";
import type { RevealExampleProps } from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.types";

type Props = RevealExampleProps;

export const PromptExample = (props: Props) => {
    return (
        <div class={styles.root}>
            <Reveal
                radius={props.radius}
                softness={props.softness}
                stepSize={props.stepSize}
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                isDisabled={props.isDisabled}
                ariaLabel={"A cover that knows when it is being looked under"}
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

import { Reveal } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Reveals/RevealPage/RevealPage.css";
import type { RevealExampleProps } from "@thewaver/ss-playground-core/App/Pages/Reveals/RevealPage/RevealPage.types";

type Props = RevealExampleProps;

export const TorchExample = (props: Props) => {
    return (
        <div class={styles.root}>
            <Reveal
                radius={props.radius}
                softness={props.softness}
                stepSize={props.stepSize}
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                isDisabled={props.isDisabled}
                ariaLabel={"A torch over a hidden note"}
                computePoints={props.computePoints()}
                renderContent={() => (
                    <div class={styles.content}>
                        <span class={styles.contentTitle}>Under the cover</span>
                        <span>The cover is whatever you pass; the component only cuts the hole in it.</span>
                        <span>The hole is a mask, so the cover keeps its own paint everywhere else.</span>
                    </div>
                )}
                renderCover={(_, getMaskStyle) => (
                    <div class={styles.solidCover} style={getMaskStyle()}>
                        Move the pointer over me
                    </div>
                )}
            />
        </div>
    );
};

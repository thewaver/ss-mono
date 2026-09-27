import { Reveal } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Reveals/RevealPage/RevealPage.css";

import type { RevealExampleProps } from "../RevealExample.types";

type Props = RevealExampleProps;

export const TorchExample = (props: Props) => {
    return (
        <div className={styles.root}>
            <Reveal
                radius={props.radius}
                softness={props.softness}
                stepSize={props.stepSize}
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                isDisabled={props.isDisabled}
                ariaLabel={"A torch over a hidden note"}
                computePoints={props.computePoints}
                renderContent={() => (
                    <div className={styles.content}>
                        <span className={styles.contentTitle}>Under the cover</span>
                        <span>The cover is whatever you pass; the component only cuts the hole in it.</span>
                        <span>The hole is a mask, so the cover keeps its own paint everywhere else.</span>
                    </div>
                )}
                renderCover={(_, maskStyle) => (
                    <div className={styles.solidCover} style={maskStyle}>
                        Move the pointer over me
                    </div>
                )}
            />
        </div>
    );
};

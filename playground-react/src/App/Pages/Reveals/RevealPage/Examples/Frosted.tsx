import { Reveal } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.css";

import type { RevealExampleProps } from "../RevealExample.types";

type Props = RevealExampleProps;

export const FrostedExample = (props: Props) => {
    return (
        <div className={styles.root}>
            <Reveal
                radius={props.radius}
                softness={props.softness}
                stepSize={props.stepSize}
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                isDisabled={props.isDisabled}
                ariaLabel={"A frosted cover over a note"}
                computePoints={props.computePoints}
                renderContent={() => (
                    <div className={styles.content}>
                        <span className={styles.contentTitle}>Frosted, not opaque</span>
                        <span>A cover that blurs rather than hides means the hole sharpens instead of uncovering.</span>
                        <span>Same component, different cover.</span>
                    </div>
                )}
                renderCover={(_, maskStyle) => <div className={styles.frostedCover} style={maskStyle} />}
            />
        </div>
    );
};

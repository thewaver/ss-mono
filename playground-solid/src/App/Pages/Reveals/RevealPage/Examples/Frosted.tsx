import { Reveal } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Reveals/RevealPage/RevealPage.css";
import type { RevealExampleProps } from "@thewaver/ss-playground-core/App/Pages/Reveals/RevealPage/RevealPage.types";

type Props = RevealExampleProps;

export const FrostedExample = (props: Props) => {
    return (
        <div class={styles.root}>
            <Reveal
                radius={props.radius}
                softness={props.softness}
                stepSize={props.stepSize}
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                isDisabled={props.isDisabled}
                ariaLabel={"A frosted cover over a note"}
                computePoints={props.computePoints()}
                renderContent={() => (
                    <div class={styles.content}>
                        <span class={styles.contentTitle}>Frosted, not opaque</span>
                        <span>A cover that blurs rather than hides means the hole sharpens instead of uncovering.</span>
                        <span>Same component, different cover.</span>
                    </div>
                )}
                renderCover={(_, getMaskStyle) => <div class={styles.frostedCover} style={getMaskStyle()} />}
            />
        </div>
    );
};

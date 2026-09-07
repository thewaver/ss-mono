import { Reveal } from "@thewaver/ss-components";

import type { RevealExampleProps } from "../RevealPage.types";

import * as styles from "../RevealPage.css";

type Props = RevealExampleProps;

export const FrostedExample = (props: Props) => {
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

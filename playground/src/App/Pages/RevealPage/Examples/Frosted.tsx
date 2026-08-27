import { Reveal } from "@thewaver/ss-components";

import type { RevealExampleProps } from "../RevealPage.types";

import * as styles from "../RevealPage.css";

type Props = RevealExampleProps;

export const FrostedExample = (props: Props) => {
    return (
        <div class={styles.root}>
            <Reveal
                radius={props.radius}
                roundness={props.roundness}
                softness={props.softness}
                isDisabled={props.isDisabled}
                renderContent={() => (
                    <div class={styles.content}>
                        <span class={styles.contentTitle}>Frosted, not opaque</span>
                        <span>A cover that blurs rather than hides means the hole sharpens instead of uncovering.</span>
                        <span>Same component, different cover.</span>
                    </div>
                )}
                renderCover={() => <div class={styles.frostedCover} />}
            />
        </div>
    );
};

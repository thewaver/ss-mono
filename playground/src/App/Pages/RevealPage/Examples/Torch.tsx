import { Reveal } from "@thewaver/ss-components";

import type { RevealExampleProps } from "../RevealPage.types";

import * as styles from "../RevealPage.css";

type Props = RevealExampleProps;

export const TorchExample = (props: Props) => {
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

import { Reveal } from "@thewaver/ss-components";

import type { RevealExampleProps } from "../RevealPage.types";

import * as styles from "../RevealPage.css";

type Props = RevealExampleProps;

export const TorchExample = (props: Props) => {
    return (
        <div class={styles.root}>
            <Reveal
                radius={props.radius}
                roundness={props.roundness}
                softness={props.softness}
                isDisabled={props.isDisabled}
                renderContent={() => (
                    <div class={styles.content}>
                        <span class={styles.contentTitle}>Under the cover</span>
                        <span>The cover is whatever you pass; the component only cuts the hole in it.</span>
                        <span>The hole is a mask, so the cover keeps its own paint everywhere else.</span>
                    </div>
                )}
                renderCover={() => <div class={styles.solidCover}>Move the pointer over me</div>}
            />
        </div>
    );
};

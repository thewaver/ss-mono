import { access } from "@thewaver/ss-components";

import type { PageDieFaceProps } from "./DieContent.types";

import * as styles from "./DieContent.css";

const LABEL_SHARE = 0.35;

export const PageDieFace = (props: PageDieFaceProps) => {
    return (
        <div
            class={styles.dieFace}
            classList={{ [styles.dieFaceShowing]: access(props.state).isShowing }}
            style={{
                "font-size": `${Math.min(access(props.state).size.width, access(props.state).size.height) * LABEL_SHARE}px`,
            }}
            aria-hidden="true"
        >
            {access(props.label)}
        </div>
    );
};

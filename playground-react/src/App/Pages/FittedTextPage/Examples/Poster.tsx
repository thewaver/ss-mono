import { FittedText } from "@thewaver/ss-components-react";
import { POSTER_LINES } from "@thewaver/ss-playground/App/Pages/FittedTextPage/FittedTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FittedTextPage/FittedTextPage.css";

import type { FittedTextExampleProps } from "../FittedTextPage.types";

type Props = FittedTextExampleProps;

export const PosterExample = (props: Props) => (
    <div className={styles.posterBox}>
        <FittedText lines={POSTER_LINES} lineHeightRatio={props.lineHeightRatio} />
    </div>
);

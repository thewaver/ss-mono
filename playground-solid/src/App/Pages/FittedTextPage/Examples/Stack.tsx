import { FittedText } from "@thewaver/ss-components-solid";
import { STACK_LINES } from "@thewaver/ss-playground/App/Pages/FittedTextPage/FittedTextPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/FittedTextPage/FittedTextPage.css";

import type { FittedTextExampleProps } from "../FittedTextPage.types";

type Props = FittedTextExampleProps;

export const StackExample = (props: Props) => (
    <div class={styles.stackBox}>
        <FittedText lines={STACK_LINES} lineHeightRatio={props.lineHeightRatio} />
    </div>
);

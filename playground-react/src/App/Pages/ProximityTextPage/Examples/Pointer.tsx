import { ProximityText } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

import type { ProximityTextExampleProps } from "../ProximityTextPageReact.types";

type Props = ProximityTextExampleProps;

export const PointerExample = (props: Props) => (
    <div className={styles.variableText}>
        <ProximityText reachPx={props.reachPx} isDisabled={props.isDisabled}>
            Move the pointer over these words and watch each letter thicken as it comes near, pushing the rest of its
            line along without ever moving a line break.
        </ProximityText>
    </div>
);

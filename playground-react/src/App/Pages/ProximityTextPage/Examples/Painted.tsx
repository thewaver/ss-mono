import { PaintedText, ProximityText } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

import type { ProximityTextExampleProps } from "../ProximityTextPageReact.types";

type Props = ProximityTextExampleProps;

export const PaintedExample = (props: Props) => (
    <div className={styles.variableText}>
        <ProximityText reachPx={props.reachPx} isDisabled={props.isDisabled}>
            <PaintedText computeFillDefs={() => [{ color: "currentColor" }]}>
                Painted letters push their neighbors along
            </PaintedText>
        </ProximityText>
    </div>
);

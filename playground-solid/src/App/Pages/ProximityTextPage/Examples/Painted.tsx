import { PaintedText, ProximityText } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";
import type { ProximityTextExampleProps } from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.types";

type Props = ProximityTextExampleProps;

export const PaintedExample = (props: Props) => (
    <div class={styles.variableText}>
        <ProximityText reachPx={props.reachPx} isDisabled={props.isDisabled}>
            <PaintedText computeFillDefs={() => [{ color: "currentColor" }]}>
                Painted letters push their neighbors along
            </PaintedText>
        </ProximityText>
    </div>
);

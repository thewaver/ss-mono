import { createUniqueId } from "solid-js";

import { PaintedText, ProximityText, SVGDefsSamples } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";
import type { ProximityTextExampleProps } from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.types";

type Props = ProximityTextExampleProps;

const GRADIENT_DURATION_MS = 4000;
const NO_BLUR = 0;

export const PaintedExample = (props: Props) => {
    const id = createUniqueId();

    return (
        <div class={styles.variableText}>
            <ProximityText reachPx={props.reachPx} isDisabled={props.isDisabled}>
                <PaintedText
                    computeFillDefs={(getSize, getRef) =>
                        SVGDefsSamples.Gradient.Timed.toConfig({ family: "flow_diag_3" }).computeSVGDefs(
                            `fill-${id}`,
                            undefined,
                            getRef,
                            {
                                getSize,
                                animationDurationMs: GRADIENT_DURATION_MS,
                                colors: SVGDefsSamples.SAMPLE_COLORS,
                                blurWidth: NO_BLUR,
                            },
                        )
                    }
                >
                    Painted letters push their neighbors along
                </PaintedText>
            </ProximityText>
        </div>
    );
};

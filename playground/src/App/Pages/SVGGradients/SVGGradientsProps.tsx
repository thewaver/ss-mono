import { For } from "solid-js";

import type { SVGDefsColors } from "@thewaver/ss-components";

import { SVGGradientKnobs } from "../../Knobs/SVGGradients.const";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PageColorField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import type { SVGGradientsControls } from "./SVGGradients.types";

import * as styles from "./SVGGradients.css";

type Props = {
    controls: SVGGradientsControls;
};

export const PageSVGGradientsProps = (props: Props) => {
    const controls = props.controls;

    return (
        <>
            <PageProp
                key={"paintKind"}
                label={"Painted as"}
                hint={"Whether the gradient paints the inside of the sample shape or only its outline."}
            >
                <PageSelectField
                    value={controls.paintKindSignal[0]}
                    values={() => SVGGradientKnobs.PAINT_KINDS}
                    ariaLabel={"Painted as"}
                    onChange={(kind) => controls.paintKindSignal[1](() => kind)}
                />
            </PageProp>

            <PageProp
                key={"colors"}
                label={"Colors"}
                hint={"The colors the gradient is built from. Each sample uses as many of them as it needs."}
            >
                <div class={styles.colorList}>
                    <For each={Object.keys(controls.colors)}>
                        {(key) => (
                            <PageColorField
                                value={() => controls.colors[key as keyof SVGDefsColors]}
                                ariaLabel={() => key}
                                onInput={(value) => controls.setColor(key as keyof SVGDefsColors, value)}
                            />
                        )}
                    </For>
                </div>
            </PageProp>

            <PageProp
                key={"blurWidth"}
                label={"Blur (px)"}
                hint={"How far the paint is blurred outward, which is what gives it its glow."}
            >
                <PageNumberField
                    value={controls.blurWidthSignal[0]}
                    min={() => SVGGradientKnobs.MIN_BLUR_WIDTH}
                    max={() => SVGGradientKnobs.MAX_BLUR_WIDTH}
                    step={() => SVGGradientKnobs.BLUR_WIDTH_STEP}
                    ariaLabel={"Blur width"}
                    onInput={controls.blurWidthSignal[1]}
                />
            </PageProp>
        </>
    );
};

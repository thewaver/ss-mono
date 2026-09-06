import { For } from "solid-js";

import type { SVGDefsColors } from "@thewaver/ss-components";

import { PageProp } from "../../PageComponents/Prop/Prop";
import { PageColorField, PageNumberField, PageSelectField } from "../../StyledComponents/Field/Field";
import { BLUR_WIDTH_STEP, MAX_BLUR_WIDTH, MIN_BLUR_WIDTH, PAINT_KINDS } from "./SVGGradients.const";
import type { SVGGradientsControls } from "./SVGGradients.types";

import * as styles from "./SVGGradients.css";

type Props = {
    controls: SVGGradientsControls;
};

export const PageSVGGradientsProps = (props: Props) => {
    const controls = props.controls;

    return (
        <>
            <PageProp key={"paintKind"} label={"Painted as"}>
                <PageSelectField
                    value={controls.paintKindSignal[0]}
                    values={() => PAINT_KINDS}
                    ariaLabel={"Painted as"}
                    onChange={(kind) => controls.paintKindSignal[1](() => kind)}
                />
            </PageProp>

            <PageProp key={"colors"} label={"Colors"}>
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

            <PageProp key={"blurWidth"} label={"Blur (px)"}>
                <PageNumberField
                    value={controls.blurWidthSignal[0]}
                    min={() => MIN_BLUR_WIDTH}
                    max={() => MAX_BLUR_WIDTH}
                    step={() => BLUR_WIDTH_STEP}
                    ariaLabel={"Blur width"}
                    onInput={controls.blurWidthSignal[1]}
                />
            </PageProp>
        </>
    );
};

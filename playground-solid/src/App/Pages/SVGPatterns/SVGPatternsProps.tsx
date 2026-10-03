import { For } from "solid-js";

import type { SVGDefsColors } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";

import { SVGPatternKnobs } from "../../Knobs/SVGPatterns.const";
import { PageColorField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import type { SVGPatternsControls } from "./SVGPatterns.types";

type Props = {
    controls: SVGPatternsControls;
};

export const PageSVGPatternsProps = (props: Props) => {
    const controls = props.controls;

    return (
        <>
            <PageProp key={"cellSize"} label={"Cell Size (px)"} hint={"How large one cell of the pattern is."}>
                <PageNumberField
                    value={controls.cellSize[0]}
                    min={() => SVGPatternKnobs.MIN_CELL_SIZE}
                    max={() => SVGPatternKnobs.MAX_CELL_SIZE}
                    step={() => SVGPatternKnobs.CELL_SIZE_STEP}
                    ariaLabel={"Cell size"}
                    onInput={controls.cellSize[1]}
                />
            </PageProp>

            <PageProp
                key={"colors"}
                label={"Colors"}
                hint={"The colors the pattern is drawn from. Each sample uses as many of them as it needs."}
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
                hint={"How far the pattern is blurred outward, which is what gives it its glow."}
            >
                <PageNumberField
                    value={controls.blurWidth[0]}
                    min={() => SVGPatternKnobs.MIN_BLUR_WIDTH}
                    max={() => SVGPatternKnobs.MAX_BLUR_WIDTH}
                    step={() => SVGPatternKnobs.BLUR_WIDTH_STEP}
                    ariaLabel={"Blur width"}
                    onInput={controls.blurWidth[1]}
                />
            </PageProp>
        </>
    );
};

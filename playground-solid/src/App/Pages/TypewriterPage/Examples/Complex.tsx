import { createSignal } from "solid-js";

import { Button, Typewriter } from "@thewaver/ss-components-solid";
import type { TypewriterController } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import knight from "@thewaver/ss-playground/App/knight.webp";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { TypewriterComplexExampleProps } from "../TypewriterPage.types";

type Props = TypewriterComplexExampleProps;

export const ComplexExample = (props: Props) => {
    const [getController, setController] = createSignal<TypewriterController>();

    return (
        <div class={styles.complexStack}>
            <PageMeasureBox width={props.width} padding={() => MEASURE_BOX_PADDING}>
                <Typewriter
                    computeAnimationName={props.computeAnimationName}
                    computeCharacterWeights={props.computeCharacterWeights}
                    onMount={setController}
                >
                    This is a bit of{" "}
                    <b>
                        text that appears
                        <div class={styles.textHighlight} style={{ color: "red" }} title="ONE MEANS ONE!">
                            <i>one</i>
                        </div>
                    </b>
                    <span>single</span>
                    {" text character\tat a time,"}
                    <br />
                    <br />
                    <div style={{ "width": "100%", "height": "0.5em", "border-bottom": "2px solid currentColor" }} />
                    {"and has\nescaped "}
                    <img src={knight} height={24} style={{ "vertical-align": "middle" }} />
                    <a href="http://www.google.com">characters.</a>
                </Typewriter>
            </PageMeasureBox>

            <Button
                id={"typeItAgain"}
                ariaLabel={"Type it again"}
                renderContent={(getFlags) => (
                    <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS.replay} />
                )}
                onClick={() => {
                    getController()?.restartAnimation();
                }}
            />
        </div>
    );
};

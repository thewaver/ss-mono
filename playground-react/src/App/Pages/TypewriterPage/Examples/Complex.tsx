import { useState } from "react";

import { Button, Typewriter } from "@thewaver/ss-components-react";
import type { TypewriterController } from "@thewaver/ss-components-react";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import type { TypewriterComplexExampleProps } from "../TypewriterPageReact.types";

type Props = TypewriterComplexExampleProps;

export const ComplexExample = (props: Props) => {
    const [controller, setController] = useState<TypewriterController>();
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVanishing, setIsVanishing] = useState(false);

    const computeAnimationName = (character: string, index: number, count: number) =>
        isVanishing ? styles.typewriterVanish : props.computeAnimationName(character, index, count);

    return (
        <div className={styles.complexStack}>
            <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
                <Typewriter
                    playback={[isPlaying, setIsPlaying]}
                    computeAnimationName={computeAnimationName}
                    computeCharacterWeights={props.computeCharacterWeights}
                    onMount={setController}
                    onAnimationEnd={() => {
                        if (isVanishing) setIsPlaying(false);
                    }}
                >
                    This is a bit of{" "}
                    <b>
                        text that appears
                        <div className={styles.textHighlight} style={{ color: "red" }} title="ONE MEANS ONE!">
                            <i>one</i>
                        </div>
                    </b>
                    <span>single</span>
                    {" text character\tat a time,"}
                    <br />
                    <br />
                    <div style={{ width: "100%", height: "0.5em", borderBottom: "2px solid currentColor" }} />
                    {"and has\nescaped "}
                    <img src={knight} alt="" height={24} style={{ verticalAlign: "middle" }} />
                    <a href="http://www.google.com">characters.</a>
                </Typewriter>
            </PageMeasureBox>

            <div className={styles.complexControls}>
                <Button
                    id={"typeItAgain"}
                    renderContent={(flags) => (
                        <PageControlButtonContent flags={flags}>Fade in</PageControlButtonContent>
                    )}
                    onClick={() => {
                        setIsVanishing(false);
                        controller?.restartAnimation();
                    }}
                />

                <Button
                    id={"fadeItOut"}
                    renderContent={(flags) => (
                        <PageControlButtonContent flags={flags}>Fade out</PageControlButtonContent>
                    )}
                    onClick={() => {
                        setIsVanishing(true);
                        controller?.restartAnimation();
                    }}
                />
            </div>
        </div>
    );
};

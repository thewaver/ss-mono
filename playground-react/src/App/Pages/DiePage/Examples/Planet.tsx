import { useState } from "react";

import { Button, Die } from "@thewaver/ss-components-react";
import type { DieController } from "@thewaver/ss-components-react";
import {
    ICON_CLOUD_EMPTY_LABEL,
    PLANET_ICONS,
    PLANET_STEPS,
} from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageDieCore, PageDieIcon } from "../../../StyledComponents/DieContent/DieContent";
import type { PlanetExampleProps } from "../DiePage.types";

type Props = PlanetExampleProps;

export const PlanetExample = (props: Props) => {
    const [controller, setController] = useState<DieController>();

    const [autoSpin, setAutoSpin] = props.autoSpin;

    return (
        <div className={styles.stage}>
            <PageMeasureBox>
                <Die
                    shape={props.shape}
                    size={props.size}
                    idleDelayMs={props.idleDelayMs}
                    settleDurationMs={props.settleDurationMs}
                    momentumMs={props.momentumMs}
                    face={props.face}
                    autoSpin={props.autoSpin}
                    isMovable={true}
                    isSeeThrough={true}
                    ariaLabel={"A planet circled by icons"}
                    computeFaceLabel={(index) => PLANET_ICONS[index]?.label ?? ICON_CLOUD_EMPTY_LABEL}
                    renderFace={(index, state) => <PageDieIcon state={state} icon={PLANET_ICONS[index]?.icon ?? ""} />}
                    renderCore={() => <PageDieCore />}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div className={styles.controls}>
                <Button
                    id={"diePlanetPlayback"}
                    ariaLabel={autoSpin ? "Pause" : "Play"}
                    renderContent={(flags) => (
                        <PageControlButtonContent
                            flags={flags}
                            glyph={autoSpin ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
                        />
                    )}
                    onClick={() => {
                        setAutoSpin(!autoSpin);
                    }}
                />

                {PLANET_STEPS.map((step) => (
                    <Button
                        key={step.direction}
                        id={step.id}
                        ariaLabel={step.label}
                        renderContent={(flags) => (
                            <PageControlButtonContent flags={flags} glyph={CONTROL_GLYPHS[step.direction]} />
                        )}
                        onClick={() => {
                            controller?.step(step.direction);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

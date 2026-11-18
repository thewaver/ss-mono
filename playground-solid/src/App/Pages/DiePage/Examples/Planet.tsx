import { For, createSignal } from "solid-js";

import { Button, Die } from "@thewaver/ss-components-solid";
import type { DieController } from "@thewaver/ss-components-solid";
import {
    ICON_CLOUD_EMPTY_LABEL,
    PLANET_CIRCLED_ICONS_LABEL,
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
    const [getController, setController] = createSignal<DieController>();

    const [getAutoSpin, setAutoSpin] = props.autoSpin;

    return (
        <div class={styles.stage}>
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
                    ariaLabel={PLANET_CIRCLED_ICONS_LABEL}
                    computeFaceLabel={(index) => PLANET_ICONS[index]?.label ?? ICON_CLOUD_EMPTY_LABEL}
                    renderFace={(getIndex, getState) => (
                        <PageDieIcon state={getState} icon={() => PLANET_ICONS[getIndex()]?.icon ?? ""} />
                    )}
                    renderCore={() => <PageDieCore />}
                    onMount={setController}
                />
            </PageMeasureBox>

            <div class={styles.controls}>
                <Button
                    id={"diePlanetPlayback"}
                    ariaLabel={() => (getAutoSpin() ? "Pause" : "Play")}
                    renderContent={(getFlags) => (
                        <PageControlButtonContent
                            flags={getFlags}
                            glyph={() => (getAutoSpin() ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play)}
                        />
                    )}
                    onClick={() => {
                        setAutoSpin(!getAutoSpin());
                    }}
                />

                <For each={PLANET_STEPS}>
                    {(step) => (
                        <Button
                            id={step.id}
                            ariaLabel={step.label}
                            renderContent={(getFlags) => (
                                <PageControlButtonContent flags={getFlags} glyph={CONTROL_GLYPHS[step.direction]} />
                            )}
                            onClick={() => {
                                getController()?.step(step.direction);
                            }}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};

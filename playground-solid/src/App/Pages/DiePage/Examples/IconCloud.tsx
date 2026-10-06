import { For, createSignal } from "solid-js";

import { Button, Die } from "@thewaver/ss-components-solid";
import type { DieController } from "@thewaver/ss-components-solid";
import {
    ICON_CLOUD_EMPTY_LABEL,
    ICON_CLOUD_ICONS,
    ICON_CLOUD_STEPS,
} from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageDieIcon } from "../../../StyledComponents/DieContent/DieContent";
import type { IconCloudExampleProps } from "../DiePage.types";

type Props = IconCloudExampleProps;

export const IconCloudExample = (props: Props) => {
    const [getController, setController] = createSignal<DieController>();

    const [getAutoSpin, setAutoSpin] = props.autoSpin;

    return (
        <div class={styles.stage}>
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
                ariaLabel={"A cloud of icons"}
                computeFaceLabel={(index) => ICON_CLOUD_ICONS[index]?.label ?? ICON_CLOUD_EMPTY_LABEL}
                renderFace={(getIndex, getState) => (
                    <PageDieIcon state={getState} icon={() => ICON_CLOUD_ICONS[getIndex()]?.icon ?? ""} />
                )}
                onMount={setController}
            />

            <div class={styles.controls}>
                <Button
                    id={"dieCloudPlayback"}
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

                <For each={ICON_CLOUD_STEPS}>
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

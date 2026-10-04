import { useState } from "react";

import { Button, Die } from "@thewaver/ss-components-react";
import type { DieController } from "@thewaver/ss-components-react";
import {
    ICON_CLOUD_EMPTY_LABEL,
    ICON_CLOUD_ICONS,
    ICON_CLOUD_STEPS,
} from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageDieIcon } from "../../../StyledComponents/DieContent/DieContent";
import type { IconCloudExampleProps } from "../DiePage.types";

type Props = IconCloudExampleProps;

export const IconCloudExample = (props: Props) => {
    const [controller, setController] = useState<DieController>();

    const [autoSpin, setAutoSpin] = props.autoSpin;

    return (
        <div className={styles.stage}>
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
                renderFace={(index, state) => <PageDieIcon state={state} icon={ICON_CLOUD_ICONS[index]?.icon ?? ""} />}
                onMount={setController}
            />

            <div className={styles.controls}>
                <Button
                    id={"dieCloudPlayback"}
                    renderContent={(flags) => (
                        <PageButtonContent flags={flags}>{autoSpin ? "Pause" : "Play"}</PageButtonContent>
                    )}
                    onClick={() => {
                        setAutoSpin(!autoSpin);
                    }}
                />

                {ICON_CLOUD_STEPS.map((step) => (
                    <Button
                        key={step.direction}
                        id={`dieCloud${step.label}`}
                        renderContent={(flags) => <PageButtonContent flags={flags}>{step.label}</PageButtonContent>}
                        onClick={() => {
                            controller?.step(step.direction);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

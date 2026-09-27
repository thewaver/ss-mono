import { Fragment, useMemo, useState } from "react";

import { Button, FrameRateMonitorReactUtils, Modal } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/PageComponents/StressTest/StressTest.css";
import { CSSUtils } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { PageModalOverlay } from "../../StyledComponents/ModalOverlay/ModalOverlay";
import { PageModalPanel } from "../../StyledComponents/ModalPanel/ModalPanel";
import { PagePropsPanel } from "../PropsPanel/PropsPanel";
import type { StressTestProps } from "./StressText.types";

export const StressTest = (props: StressTestProps) => {
    const modalVisibility = useState(false);
    const [isModalOpen, setModalOpen] = modalVisibility;
    const [isModalTransitionFinished, setModalTransitionFinished] = useState(false);
    const [configIndex, setConfigIndex] = useState(0);

    const arr = useMemo(
        () => Array.from({ length: props.configs[configIndex].count }, (_, idx) => idx),
        [props.configs, configIndex],
    );

    const isMonitoringDisabled = !(isModalOpen && isModalTransitionFinished);

    const frameRate = FrameRateMonitorReactUtils.useFrameRate(isMonitoringDisabled);

    return (
        <>
            <PagePropsPanel scope={"local"}>
                {props.configs.map((_, index) => (
                    <Button
                        key={index}
                        sizing={"fill"}
                        onClick={async () => {
                            setConfigIndex(index);
                            setModalOpen(true);
                        }}
                        renderContent={(flags) => (
                            <PageButtonContent flags={flags}>{props.renderLabel(index)}</PageButtonContent>
                        )}
                    />
                ))}
            </PagePropsPanel>

            <Modal
                margins={CSSUtils.spreadMargin(40)}
                visibilityState={modalVisibility}
                ariaLabel={"Stress test"}
                onShow={props.onShowModal}
                onHide={props.onHideModal}
                onTransitionStatusChange={setModalTransitionFinished}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <PageModalOverlay visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs} />
                )}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageModalPanel visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        <div
                            className={[
                                styles.fpsCounter,
                                styles.fpsCounterVariants[
                                    frameRate.average >= 59.5 ? "good" : frameRate.average >= 29.5 ? "mid" : "bad"
                                ],
                            ].join(" ")}
                        >{`FPS: ${frameRate.current.toFixed(1)}\nAVG: ${frameRate.average.toFixed(1)}`}</div>
                        <div
                            className={styles.itemGrid}
                            style={{
                                gridTemplateColumns: `repeat(${props.configs[configIndex].cols}, auto)`,
                                gap: `${props.configs[configIndex].gap}px`,
                            }}
                        >
                            {arr.map((index) => (
                                <Fragment key={index}>{props.renderItem(configIndex, index)}</Fragment>
                            ))}
                        </div>
                    </PageModalPanel>
                )}
            />
        </>
    );
};

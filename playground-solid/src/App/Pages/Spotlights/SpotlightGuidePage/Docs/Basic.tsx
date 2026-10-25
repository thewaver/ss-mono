import { For, createSignal } from "solid-js";

import { Button, SpotlightGuide } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import {
    PageSpotlightPopup,
    PageSpotlightPopupActions,
    PageSpotlightPopupText,
} from "../../../../StyledComponents/SpotlightPopup/SpotlightPopup";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightGuideBasicDocsExampleProps } from "../../SpotlightsSolid.types";

type Props = SpotlightGuideBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const getLayerClass = useLayerClass();

    const visibility = createSignal(false);
    const [getStep, setStep] = createSignal(0);
    const [getStatus, setStatus] = createSignal("not started");

    const stepRefs: HTMLElement[] = [];

    const getIsLastStep = () => getStep() >= TOUR_STEPS.length - 1;

    const end = (status: string) => {
        setStatus(status);
        visibility[1](false);
    };

    return (
        <div class={[styles.root, getLayerClass()].join(" ")}>
            <div class={styles.tourStrip} data-scroll-box>
                <For each={TOUR_STEPS}>
                    {(step, getIndex) => (
                        <div
                            ref={(element) => {
                                stepRefs[getIndex()] = element;
                            }}
                            class={styles.tourTarget}
                        >
                            {step.title}
                        </div>
                    )}
                </For>
            </div>

            <Button
                id={"guideStart"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Take the tour</PageButtonContent>}
                onClick={() => {
                    setStep(0);
                    setStatus("running");
                    visibility[1](true);
                }}
            />

            <SpotlightGuide
                elementRef={() => stepRefs[getStep()]}
                padding={props.padding}
                transitionDurationMs={props.transitionDurationMs}
                popupPlacement={props.popupPlacement}
                popupOffset={props.popupOffset}
                ariaLabel={"Product tour"}
                announcement={() => `Step ${getStep() + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[getStep()].title}.`}
                visibility={visibility}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
                renderPopup={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageSpotlightPopup
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        title={() => TOUR_STEPS[getStep()].title}
                    >
                        <PageSpotlightPopupText>{TOUR_STEPS[getStep()].text}</PageSpotlightPopupText>

                        <PageSpotlightPopupActions>
                            <Button
                                id={"guideSkip"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Skip all</PageButtonContent>
                                )}
                                onClick={() => end("skipped")}
                            />

                            <Button
                                id={"guideNext"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>
                                        {getIsLastStep() ? "Done" : "Next"}
                                    </PageButtonContent>
                                )}
                                onClick={() => {
                                    if (getIsLastStep()) {
                                        end("finished");

                                        return;
                                    }

                                    setStep((step) => step + 1);
                                }}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
                onHide={() => setStatus((status) => (status === "running" ? "closed with Escape" : status))}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Tour: ${getStatus()}`}
            </div>
        </div>
    );
};

import { For, createSignal } from "solid-js";

import { Button, SpotlightGuide } from "@thewaver/ss-components-solid";
import { PADDING, TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import {
    PageSpotlightPopup,
    PageSpotlightPopupActions,
    PageSpotlightPopupText,
} from "../../../../StyledComponents/SpotlightPopup/SpotlightPopup";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";

export const RightToLeftDocsExample = () => {
    const getLayerClass = useLayerClass();

    const visibility = createSignal(false);
    const [getStep, setStep] = createSignal(0);

    const stepRefs: HTMLElement[] = [];

    const getIsLastStep = () => getStep() >= TOUR_STEPS.length - 1;

    return (
        <div dir={"rtl"} class={[styles.root, getLayerClass()].join(" ")}>
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
                id={"rightToLeftGuideStart"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Take the tour</PageButtonContent>}
                onClick={() => {
                    setStep(0);
                    visibility[1](true);
                }}
            />

            <SpotlightGuide
                elementRef={() => stepRefs[getStep()]}
                padding={PADDING}
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
                                id={"rightToLeftGuideSkip"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Skip all</PageButtonContent>
                                )}
                                onClick={() => {
                                    visibility[1](false);
                                }}
                            />

                            <Button
                                id={"rightToLeftGuideNext"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>
                                        {getIsLastStep() ? "Done" : "Next"}
                                    </PageButtonContent>
                                )}
                                onClick={() => {
                                    if (getIsLastStep()) {
                                        visibility[1](false);

                                        return;
                                    }

                                    setStep((step) => step + 1);
                                }}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
            />
        </div>
    );
};

import { useState } from "react";

import { Button, SpotlightGuide } from "@thewaver/ss-components-react";
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
    const layerClass = useLayerClass();

    const visibility = useState(false);
    const [, setIsVisible] = visibility;
    const [step, setStep] = useState(0);

    const [stepRefs, setStepRefs] = useState<(HTMLElement | undefined)[]>(() => TOUR_STEPS.map(() => undefined));

    const [stepRefSetters] = useState(() =>
        TOUR_STEPS.map((_step, index) => (element: HTMLElement | null) => {
            setStepRefs((refs) => refs.map((ref, refIndex) => (refIndex === index ? (element ?? undefined) : ref)));
        }),
    );

    const isLastStep = step >= TOUR_STEPS.length - 1;

    return (
        <div dir={"rtl"} className={[styles.root, layerClass].join(" ")}>
            <div className={styles.tourStrip} data-scroll-box="">
                {TOUR_STEPS.map((tourStep, index) => (
                    <div key={tourStep.title} ref={stepRefSetters[index]} className={styles.tourTarget}>
                        {tourStep.title}
                    </div>
                ))}
            </div>

            <Button
                id={"rightToLeftGuideStart"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Take the tour</PageButtonContent>}
                onClick={() => {
                    setStep(0);
                    setIsVisible(true);
                }}
            />

            <SpotlightGuide
                elementRef={stepRefs[step]}
                padding={PADDING}
                ariaLabel={"Product tour"}
                announcement={`Step ${step + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[step].title}.`}
                visibility={visibility}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
                renderPopup={(visibilityTarget, transitionDurationMs) => (
                    <PageSpotlightPopup
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        title={TOUR_STEPS[step].title}
                    >
                        <PageSpotlightPopupText>{TOUR_STEPS[step].text}</PageSpotlightPopupText>

                        <PageSpotlightPopupActions>
                            <Button
                                id={"rightToLeftGuideSkip"}
                                renderContent={(flags) => <PageButtonContent flags={flags}>Skip all</PageButtonContent>}
                                onClick={() => {
                                    setIsVisible(false);
                                }}
                            />

                            <Button
                                id={"rightToLeftGuideNext"}
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>{isLastStep ? "Done" : "Next"}</PageButtonContent>
                                )}
                                onClick={() => {
                                    if (isLastStep) {
                                        setIsVisible(false);

                                        return;
                                    }

                                    setStep((current) => current + 1);
                                }}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
            />
        </div>
    );
};

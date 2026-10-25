import { useState } from "react";

import { Button, SpotlightGuide } from "@thewaver/ss-components-react";
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
import type { SpotlightGuideBasicDocsExampleProps } from "../../SpotlightsReact.types";

type Props = SpotlightGuideBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const layerClass = useLayerClass();

    const visibility = useState(false);
    const [, setIsVisible] = visibility;
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("not started");

    const [stepRefs, setStepRefs] = useState<(HTMLElement | undefined)[]>(() => TOUR_STEPS.map(() => undefined));

    const [stepRefSetters] = useState(() =>
        TOUR_STEPS.map((_step, index) => (element: HTMLElement | null) => {
            setStepRefs((refs) => refs.map((ref, refIndex) => (refIndex === index ? (element ?? undefined) : ref)));
        }),
    );

    const isLastStep = step >= TOUR_STEPS.length - 1;

    const end = (nextStatus: string) => {
        setStatus(nextStatus);
        setIsVisible(false);
    };

    return (
        <div className={[styles.root, layerClass].join(" ")}>
            <div className={styles.tourStrip} data-scroll-box="">
                {TOUR_STEPS.map((tourStep, index) => (
                    <div key={tourStep.title} ref={stepRefSetters[index]} className={styles.tourTarget}>
                        {tourStep.title}
                    </div>
                ))}
            </div>

            <Button
                id={"guideStart"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Take the tour</PageButtonContent>}
                onClick={() => {
                    setStep(0);
                    setStatus("running");
                    setIsVisible(true);
                }}
            />

            <SpotlightGuide
                elementRef={stepRefs[step]}
                padding={props.padding}
                transitionDurationMs={props.transitionDurationMs}
                popupPlacement={props.popupPlacement}
                popupOffset={props.popupOffset}
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
                                id={"guideSkip"}
                                renderContent={(flags) => <PageButtonContent flags={flags}>Skip all</PageButtonContent>}
                                onClick={() => end("skipped")}
                            />

                            <Button
                                id={"guideNext"}
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>{isLastStep ? "Done" : "Next"}</PageButtonContent>
                                )}
                                onClick={() => {
                                    if (isLastStep) {
                                        end("finished");

                                        return;
                                    }

                                    setStep((current) => current + 1);
                                }}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
                onHide={() => setStatus((current) => (current === "running" ? "closed with Escape" : current))}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Tour: ${status}`}
            </div>
        </div>
    );
};

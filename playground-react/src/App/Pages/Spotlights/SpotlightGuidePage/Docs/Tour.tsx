import { useState } from "react";

import { Button, SpotlightGuide, SpotlightPrompt } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    RICH_TOUR_STEPS,
    TOUR_STORAGE_KEY,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import {
    PageSpotlightPopup,
    PageSpotlightPopupActions,
    PageSpotlightPopupText,
} from "../../../../StyledComponents/SpotlightPopup/SpotlightPopup";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";

const readStoredStep = () => {
    try {
        const stored = sessionStorage.getItem(TOUR_STORAGE_KEY);
        const step = stored === null ? Number.NaN : Number(stored);

        return Number.isInteger(step) && step >= 0 && step < RICH_TOUR_STEPS.length ? step : undefined;
    } catch {
        return undefined;
    }
};

const writeStoredStep = (step: number | undefined) => {
    try {
        if (step === undefined) sessionStorage.removeItem(TOUR_STORAGE_KEY);
        else sessionStorage.setItem(TOUR_STORAGE_KEY, `${step}`);
    } catch {
        return;
    }
};

export const TourDocsExample = () => {
    const layerClass = useLayerClass();

    const guide = useState(false);
    const prompt = useState(false);
    const [, setIsGuideVisible] = guide;
    const [isPromptVisible, setIsPromptVisible] = prompt;

    const [step, setStep] = useState(0);
    const [resumeStep, setResumeStep] = useState(readStoredStep);
    const [status, setStatus] = useState(() => (resumeStep === undefined ? "not started" : "paused"));
    const [basketCount, setBasketCount] = useState(0);

    const [shelfRef, setShelfRef] = useState<HTMLElement | null>(null);
    const [addRef, setAddRef] = useState<HTMLElement | null>(null);
    const [basketRef, setBasketRef] = useState<HTMLElement | null>(null);
    const [checkoutRef, setCheckoutRef] = useState<HTMLElement | null>(null);

    const targets = [shelfRef, addRef, basketRef, checkoutRef];

    const current = RICH_TOUR_STEPS[step];

    const isFirstStep = step === 0;

    const isLastStep = step >= RICH_TOUR_STEPS.length - 1;

    const changeStep = (nextStep: number) => {
        setStep(nextStep);
        setResumeStep(nextStep);
        writeStoredStep(nextStep);
    };

    const start = () => {
        changeStep(resumeStep ?? 0);
        setStatus("running");
        setIsGuideVisible(true);
    };

    const end = (nextStatus: string) => {
        setStatus(nextStatus);
        setIsGuideVisible(false);
        setIsPromptVisible(false);
        setResumeStep(undefined);
        writeStoredStep(undefined);
    };

    const pause = () => {
        setStatus((currentStatus) => (currentStatus === "running" ? "paused" : currentStatus));
    };

    const handOverToReader = () => {
        setIsPromptVisible(true);
    };

    const next = () => {
        if (isLastStep) {
            end("finished");

            return;
        }

        changeStep(step + 1);
    };

    return (
        <div className={[styles.root, layerClass].join(" ")}>
            <div className={styles.tourRow}>
                <div ref={setShelfRef} className={styles.tourTarget}>
                    Potatoes
                </div>

                <Button
                    id={"tourAdd"}
                    ref={setAddRef}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Add to basket</PageButtonContent>}
                    onClick={() => {
                        setBasketCount((count) => count + 1);

                        if (!isPromptVisible) return;

                        setIsPromptVisible(false);
                        changeStep(step + 1);
                    }}
                />

                <div ref={setBasketRef} className={styles.tourTarget}>
                    {`Basket: ${basketCount}`}
                </div>

                <Button
                    id={"tourCheckout"}
                    ref={setCheckoutRef}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Checkout</PageButtonContent>}
                />
            </div>

            <Button
                id={"tourStart"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>
                        {resumeStep === undefined
                            ? "Start the shop tour"
                            : `Resume the shop tour at step ${resumeStep + 1}`}
                    </PageButtonContent>
                )}
                onClick={start}
            />

            <SpotlightGuide
                elementRef={targets[step] ?? undefined}
                padding={PADDING}
                ariaLabel={"Shop tour"}
                announcement={`Step ${step + 1} of ${RICH_TOUR_STEPS.length}. ${current.title}.`}
                visibility={guide}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
                renderPopup={(visibilityTarget, transitionDurationMs) => (
                    <PageSpotlightPopup
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        title={current.title}
                    >
                        <PageSpotlightPopupText>{current.text}</PageSpotlightPopupText>

                        <PageSpotlightPopupText>{`Step ${step + 1} of ${RICH_TOUR_STEPS.length}`}</PageSpotlightPopupText>

                        <PageSpotlightPopupActions>
                            <Button
                                id={"tourSkip"}
                                renderContent={(flags) => <PageButtonContent flags={flags}>Skip</PageButtonContent>}
                                onClick={() => end("skipped")}
                            />

                            <Button
                                id={"tourBack"}
                                isDisabled={isFirstStep}
                                renderContent={(flags) => <PageButtonContent flags={flags}>Back</PageButtonContent>}
                                onClick={() => changeStep(step - 1)}
                            />

                            <Button
                                id={"tourForward"}
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>
                                        {current.isWaitingForUser ? "Try" : isLastStep ? "Done" : "Next"}
                                    </PageButtonContent>
                                )}
                                onClick={() => (current.isWaitingForUser ? handOverToReader() : next())}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
                onHide={pause}
            />

            <SpotlightPrompt
                elementRef={addRef ?? undefined}
                padding={PADDING}
                visibility={prompt}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Step: ${step + 1} of ${RICH_TOUR_STEPS.length}, ${status}`}
            </div>
        </div>
    );
};

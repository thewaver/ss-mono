import { createSignal } from "solid-js";

import { Button, SpotlightGuide, SpotlightPrompt } from "@thewaver/ss-components-solid";
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
    const getLayerClass = useLayerClass();

    const guide = createSignal(false);
    const prompt = createSignal(false);

    const [getStep, setStep] = createSignal(0);
    const [getResumeStep, setResumeStep] = createSignal(readStoredStep());
    const [getStatus, setStatus] = createSignal(getResumeStep() === undefined ? "not started" : "paused");
    const [getBasketCount, setBasketCount] = createSignal(0);

    const [getShelfRef, setShelfRef] = createSignal<HTMLElement>();
    const [getAddRef, setAddRef] = createSignal<HTMLElement>();
    const [getBasketRef, setBasketRef] = createSignal<HTMLElement>();
    const [getCheckoutRef, setCheckoutRef] = createSignal<HTMLElement>();

    const getTargets = () => [getShelfRef(), getAddRef(), getBasketRef(), getCheckoutRef()];

    const getCurrent = () => RICH_TOUR_STEPS[getStep()];

    const getIsFirstStep = () => getStep() === 0;

    const getIsLastStep = () => getStep() >= RICH_TOUR_STEPS.length - 1;

    const changeStep = (step: number) => {
        setStep(step);
        setResumeStep(step);
        writeStoredStep(step);
    };

    const start = () => {
        changeStep(getResumeStep() ?? 0);
        setStatus("running");
        guide[1](true);
    };

    const end = (status: string) => {
        setStatus(status);
        guide[1](false);
        prompt[1](false);
        setResumeStep(undefined);
        writeStoredStep(undefined);
    };

    const pause = () => {
        setStatus((status) => (status === "running" ? "paused" : status));
    };

    const handOverToReader = () => {
        prompt[1](true);
    };

    const next = () => {
        if (getIsLastStep()) {
            end("finished");

            return;
        }

        changeStep(getStep() + 1);
    };

    return (
        <div class={[styles.root, getLayerClass()].join(" ")}>
            <div class={styles.tourRow}>
                <div ref={setShelfRef} class={styles.tourTarget}>
                    Potatoes
                </div>

                <Button
                    id={"tourAdd"}
                    ref={setAddRef}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Add to basket</PageButtonContent>}
                    onClick={() => {
                        setBasketCount((count) => count + 1);

                        if (!prompt[0]()) return;

                        prompt[1](false);
                        changeStep(getStep() + 1);
                    }}
                />

                <div ref={setBasketRef} class={styles.tourTarget}>
                    {`Basket: ${getBasketCount()}`}
                </div>

                <Button
                    id={"tourCheckout"}
                    ref={setCheckoutRef}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Checkout</PageButtonContent>}
                />
            </div>

            <Button
                id={"tourStart"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>
                        {getResumeStep() === undefined
                            ? "Start the shop tour"
                            : `Resume the shop tour at step ${getResumeStep()! + 1}`}
                    </PageButtonContent>
                )}
                onClick={start}
            />

            <SpotlightGuide
                elementRef={() => getTargets()[getStep()]}
                padding={PADDING}
                ariaLabel={"Shop tour"}
                announcement={() => `Step ${getStep() + 1} of ${RICH_TOUR_STEPS.length}. ${getCurrent().title}.`}
                visibility={guide}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
                renderPopup={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageSpotlightPopup
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        title={() => getCurrent().title}
                    >
                        <PageSpotlightPopupText>{getCurrent().text}</PageSpotlightPopupText>

                        <PageSpotlightPopupText>
                            {`Step ${getStep() + 1} of ${RICH_TOUR_STEPS.length}`}
                        </PageSpotlightPopupText>

                        <PageSpotlightPopupActions>
                            <Button
                                id={"tourSkip"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Skip</PageButtonContent>
                                )}
                                onClick={() => end("skipped")}
                            />

                            <Button
                                id={"tourBack"}
                                isDisabled={getIsFirstStep}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Back</PageButtonContent>
                                )}
                                onClick={() => changeStep(getStep() - 1)}
                            />

                            <Button
                                id={"tourForward"}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>
                                        {getCurrent().isWaitingForUser ? "Try" : getIsLastStep() ? "Done" : "Next"}
                                    </PageButtonContent>
                                )}
                                onClick={() => (getCurrent().isWaitingForUser ? handOverToReader() : next())}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
                onHide={pause}
            />

            <SpotlightPrompt
                elementRef={getAddRef}
                padding={PADDING}
                visibility={prompt}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Step: ${getStep() + 1} of ${RICH_TOUR_STEPS.length}, ${getStatus()}`}
            </div>
        </div>
    );
};

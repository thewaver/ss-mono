import { useState } from "react";

import { Button, SpotlightGuide, SpotlightPrompt } from "@thewaver/ss-components-react";
import { RICH_TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

import { PageControlRow } from "../../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import {
    PageSpotlightPopup,
    PageSpotlightPopupActions,
    PageSpotlightPopupText,
} from "../../../../StyledComponents/SpotlightPopup/SpotlightPopup";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightTourExampleProps } from "../SpotlightGuidePage.types";

type Props = SpotlightTourExampleProps;

export const TourExample = (props: Props) => {
    const layerClass = useLayerClass();

    const [shelfRef, setShelfRef] = useState<HTMLElement | null>(null);
    const [addRef, setAddRef] = useState<HTMLElement | null>(null);
    const [basketRef, setBasketRef] = useState<HTMLElement | null>(null);
    const [checkoutRef, setCheckoutRef] = useState<HTMLElement | null>(null);

    const targets = [shelfRef, addRef, basketRef, checkoutRef];

    const step = props.step;

    const current = RICH_TOUR_STEPS[step];

    const isFirstStep = step === 0;

    const isLastStep = step >= RICH_TOUR_STEPS.length - 1;

    const handOverToUser = () => {
        props.guideState[1](false);
        props.promptState[1](true);
    };

    const next = () => {
        if (isLastStep) {
            props.onEnd("finished");

            return;
        }

        props.onStepChange(step + 1);
    };

    return (
        <div className={[styles.root, layerClass].join(" ")}>
            <PageControlRow>
                <div ref={setShelfRef} className={styles.tourTarget}>
                    Potatoes
                </div>

                <Button
                    id={"tourAdd"}
                    ref={setAddRef}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Add to basket</PageButtonContent>}
                    onClick={() => {
                        props.onAdd();

                        if (!props.promptState[0]) return;

                        props.promptState[1](false);
                        props.onStepChange(step + 1);
                        props.guideState[1](true);
                    }}
                />

                <div ref={setBasketRef} className={styles.tourTarget}>
                    {`Basket: ${props.basketCount}`}
                </div>

                <Button
                    id={"tourCheckout"}
                    ref={setCheckoutRef}
                    renderContent={(flags) => <PageButtonContent flags={flags}>Checkout</PageButtonContent>}
                />
            </PageControlRow>

            <Button
                id={"tourStart"}
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>
                        {props.resumeStep === undefined
                            ? "Start the shop tour"
                            : `Resume the shop tour at step ${props.resumeStep + 1}`}
                    </PageButtonContent>
                )}
                onClick={() => {
                    props.onStart();
                    props.guideState[1](true);
                }}
            />

            <SpotlightGuide
                elementRef={targets[step] ?? undefined}
                padding={PADDING}
                ariaLabel={"Shop tour"}
                announcement={`Step ${step + 1} of ${RICH_TOUR_STEPS.length}. ${current.title}.`}
                visibilityState={props.guideState}
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
                                renderContent={(flags) => <PageButtonContent flags={flags}>Skip</PageButtonContent>}
                                onClick={() => props.onEnd("skipped")}
                            />

                            <Button
                                isDisabled={isFirstStep}
                                renderContent={(flags) => <PageButtonContent flags={flags}>Back</PageButtonContent>}
                                onClick={() => props.onStepChange(step - 1)}
                            />

                            <Button
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>
                                        {current.isWaitingForUser ? "Try" : isLastStep ? "Done" : "Next"}
                                    </PageButtonContent>
                                )}
                                onClick={() => (current.isWaitingForUser ? handOverToUser() : next())}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
            />

            <SpotlightPrompt
                elementRef={addRef ?? undefined}
                padding={PADDING}
                visibilityState={props.promptState}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </div>
    );
};

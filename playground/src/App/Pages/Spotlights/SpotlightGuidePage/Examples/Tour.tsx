import { createSignal } from "solid-js";

import { Button, SpotlightGuide, SpotlightPrompt, access } from "@thewaver/ss-components";

import { PageControlRow } from "../../../../PageComponents/ControlRow/ControlRow";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageSpotlightPopup,
    PageSpotlightPopupActions,
    PageSpotlightPopupText,
} from "../../../../StyledComponents/SpotlightPopup/SpotlightPopup";
import { PADDING, renderHighlight, renderOverlay } from "../../Spotlights.const";
import { RICH_TOUR_STEPS } from "../SpotlightGuidePage.const";
import type { SpotlightTourExampleProps } from "../SpotlightGuidePage.types";

import * as styles from "../../Spotlights.css";

type Props = SpotlightTourExampleProps;

export const TourExample = (props: Props) => {
    const [getShelfRef, setShelfRef] = createSignal<HTMLElement>();
    const [getAddRef, setAddRef] = createSignal<HTMLElement>();
    const [getBasketRef, setBasketRef] = createSignal<HTMLElement>();
    const [getCheckoutRef, setCheckoutRef] = createSignal<HTMLElement>();

    const getTargets = () => [getShelfRef(), getAddRef(), getBasketRef(), getCheckoutRef()];

    const getStep = () => access(props.step);

    const getCurrent = () => RICH_TOUR_STEPS[getStep()];

    const getIsFirstStep = () => getStep() === 0;

    const getIsLastStep = () => getStep() >= RICH_TOUR_STEPS.length - 1;

    const handOverToUser = () => {
        props.guideSignal[1](false);
        props.promptSignal[1](true);
    };

    const next = () => {
        if (getIsLastStep()) {
            props.onEnd("finished");

            return;
        }

        props.onStepChange(getStep() + 1);
    };

    return (
        <div class={styles.root}>
            <PageControlRow>
                <div ref={setShelfRef} class={styles.tourTarget}>
                    Potatoes
                </div>

                <Button
                    id={"tourAdd"}
                    ref={setAddRef}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Add to basket</PageButtonContent>}
                    onClick={() => {
                        props.onAdd();

                        if (!props.promptSignal[0]()) return;

                        props.promptSignal[1](false);
                        props.onStepChange(getStep() + 1);
                        props.guideSignal[1](true);
                    }}
                />

                <div ref={setBasketRef} class={styles.tourTarget}>
                    {`Basket: ${access(props.basketCount)}`}
                </div>

                <Button
                    id={"tourCheckout"}
                    ref={setCheckoutRef}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Checkout</PageButtonContent>}
                />
            </PageControlRow>

            <Button
                id={"tourStart"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>
                        {access(props.resumeStep) === undefined
                            ? "Start the shop tour"
                            : `Resume the shop tour at step ${access(props.resumeStep)! + 1}`}
                    </PageButtonContent>
                )}
                onClick={() => {
                    props.onStart();
                    props.guideSignal[1](true);
                }}
            />

            <SpotlightGuide
                elementRef={() => getTargets()[getStep()]}
                padding={() => PADDING}
                ariaLabel={"Shop tour"}
                announcement={() => `Step ${getStep() + 1} of ${RICH_TOUR_STEPS.length}. ${getCurrent().title}.`}
                visibilitySignal={props.guideSignal}
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
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Skip</PageButtonContent>
                                )}
                                onClick={() => props.onEnd("skipped")}
                            />

                            <Button
                                isDisabled={getIsFirstStep}
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>Back</PageButtonContent>
                                )}
                                onClick={() => props.onStepChange(getStep() - 1)}
                            />

                            <Button
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>
                                        {getCurrent().isWaitingForUser ? "Try it" : getIsLastStep() ? "Done" : "Next"}
                                    </PageButtonContent>
                                )}
                                onClick={() => (getCurrent().isWaitingForUser ? handOverToUser() : next())}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
            />

            <SpotlightPrompt
                elementRef={getAddRef}
                padding={() => PADDING}
                visibilitySignal={props.promptSignal}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
            />
        </div>
    );
};

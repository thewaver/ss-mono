import { useState } from "react";

import { Button, SpotlightGuide } from "@thewaver/ss-components-react";
import { PADDING, TOUR_STEPS } from "@thewaver/ss-playground-core/App/Pages/Spotlights/SpotlightTourSteps.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/Spotlights/Spotlights.css";

import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import { useLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
import {
    PageSpotlightPopup,
    PageSpotlightPopupActions,
    PageSpotlightPopupText,
} from "../../../../StyledComponents/SpotlightPopup/SpotlightPopup";
import { renderHighlight, renderOverlay } from "../../Spotlights.const";
import type { SpotlightGuideExampleProps } from "../../Spotlights.types";

type Props = SpotlightGuideExampleProps;

export const GuideExample = (props: Props) => {
    const layerClass = useLayerClass();

    const [stepRefs, setStepRefs] = useState<(HTMLElement | undefined)[]>(() => TOUR_STEPS.map(() => undefined));

    const [stepRefSetters] = useState(() =>
        TOUR_STEPS.map((_step, index) => (element: HTMLElement | null) => {
            setStepRefs((refs) => refs.map((ref, refIndex) => (refIndex === index ? (element ?? undefined) : ref)));
        }),
    );

    const isLastStep = props.step >= TOUR_STEPS.length - 1;

    return (
        <div className={[styles.root, layerClass].join(" ")}>
            <div className={styles.tourStrip} data-scroll-box="">
                {TOUR_STEPS.map((step, index) => (
                    <div key={step.title} ref={stepRefSetters[index]} className={styles.tourTarget}>
                        {step.title}
                    </div>
                ))}
            </div>

            <Button
                renderContent={(flags) => <PageButtonContent flags={flags}>Take the tour</PageButtonContent>}
                onClick={async () => {
                    props.onStart();
                    props.visibilityState[1](true);
                }}
            />

            <SpotlightGuide
                elementRef={stepRefs[props.step]}
                padding={PADDING}
                ariaLabel={"Product tour"}
                announcement={`Step ${props.step + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[props.step].title}.`}
                visibilityState={props.visibilityState}
                renderHighlight={renderHighlight}
                renderOverlay={renderOverlay}
                renderPopup={(visibilityTarget, transitionDurationMs) => (
                    <PageSpotlightPopup
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        title={TOUR_STEPS[props.step].title}
                    >
                        <PageSpotlightPopupText>{TOUR_STEPS[props.step].text}</PageSpotlightPopupText>

                        <PageSpotlightPopupActions>
                            <Button
                                renderContent={(flags) => <PageButtonContent flags={flags}>Skip all</PageButtonContent>}
                                onClick={async () => props.onEnd("skipped")}
                            />

                            <Button
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>{isLastStep ? "Done" : "Next"}</PageButtonContent>
                                )}
                                onClick={async () => {
                                    if (!isLastStep) {
                                        props.onStepChange(props.step + 1);

                                        return;
                                    }

                                    props.onEnd("finished");
                                }}
                            />
                        </PageSpotlightPopupActions>
                    </PageSpotlightPopup>
                )}
            />
        </div>
    );
};

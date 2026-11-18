import { useState } from "react";

import { CAROUSEL_DEFAULTS, CAROUSEL_ORIENTATIONS, CarouselPlacements } from "@thewaver/ss-components-react";
import type { CarouselOrientation } from "@thewaver/ss-components-react";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { FIELD_WIDTH, PLACEMENT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import { PageDocsAlert } from "../../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { LooksDocsExample } from "./Docs/Looks";
import { LoopingDocsExample } from "./Docs/Looping";
import { PairsDocsExample } from "./Docs/Pairs";
import { ScrolledDocsExample } from "./Docs/Scrolled";
import { WindowedDocsExample } from "./Docs/Windowed";

export const CarouselDocs = () => {
    const [transitionDurationMs, setTransitionDurationMs] = useState(CAROUSEL_DEFAULTS.transitionDurationMs);
    const [orientation, setOrientation] = useState<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    const [isDisabled, setIsDisabled] = useState(false);
    const [placement, setPlacement] = useState<CarouselPlacements.SampleKey>(CarouselKnobs.STARTING_PLACEMENT);
    const [looksOrientation, setLooksOrientation] = useState<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
    const [isLooping, setIsLooping] = useState(CAROUSEL_DEFAULTS.isLooping);
    const [autoplayDelayMs, setAutoplayDelayMs] = useState(CarouselKnobs.STARTING_DELAY_MS);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                Build Previous and Next buttons on the controller{" "}
                <span className={docsStyles.docsPropName}>onMount</span> hands you, since not everyone can swipe (
                <a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>), and if the carousel moves on its own, a button that stops
                it (<a href={WCAG_URLS["2.2.2"]}>WCAG 2.2.2</a>). Pass those buttons' hover and focus to{" "}
                <span className={docsStyles.docsPropName}>setIsHeldByPage</span>, so it holds still while someone is
                using them.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"transitionDurationMs"} {...CarouselKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={transitionDurationMs}
                                min={CarouselKnobs.MIN_TRANSITION_MS}
                                max={CarouselKnobs.MAX_TRANSITION_MS}
                                step={CarouselKnobs.TRANSITION_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>

                        <PageProp itemKey={"orientation"} {...CarouselKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={orientation}
                                values={CAROUSEL_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...CarouselKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    orientation={orientation}
                    transitionDurationMs={transitionDurationMs}
                    isDisabled={isDisabled}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.looks} />

            <PageDocsAlert severity={"info"}>
                The looks here are only examples. Any rule you write can be the{" "}
                <span className={docsStyles.docsPropName}>placement</span>: a function told how far a slide is from the
                one showing that answers where to draw it, so the layout is entirely yours.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Looks.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"placement"} {...CarouselKnobs.PLACEMENT_TEXT}>
                            <PageSelectField
                                value={placement}
                                values={CarouselPlacements.SAMPLE_KEYS}
                                width={PLACEMENT_FIELD_WIDTH}
                                ariaLabel={"Placement"}
                                onChange={setPlacement}
                            />
                        </PageProp>

                        <PageProp itemKey={"orientation"} {...CarouselKnobs.ORIENTATION_2_TEXT}>
                            <PageSelectField
                                value={looksOrientation}
                                values={CAROUSEL_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setLooksOrientation}
                            />
                        </PageProp>
                    </>
                )}
            >
                <LooksDocsExample placement={placement} orientation={looksOrientation} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.loopingAndSelfMoving} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Looping.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"isLooping"} {...CarouselKnobs.IS_LOOPING_TEXT}>
                            <PageCheckField value={isLooping} ariaLabel={"Looping"} onChange={setIsLooping} />
                        </PageProp>

                        <PageProp itemKey={"autoplayDelayMs"} {...CarouselKnobs.AUTOPLAY_DELAY_MS_TEXT}>
                            <PageNumberField
                                value={autoplayDelayMs}
                                min={CarouselKnobs.MIN_DELAY_MS}
                                max={CarouselKnobs.MAX_DELAY_MS}
                                step={CarouselKnobs.DELAY_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Delay in milliseconds"}
                                onInput={setAutoplayDelayMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <LoopingDocsExample isLooping={isLooping} autoplayDelayMs={autoplayDelayMs} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.drivenOutside} />

            <PageDocsExample path={`${DOCS_ROOT}/Scrolled.tsx`}>
                <ScrolledDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.severalSlidesStop} />

            <PageDocsExample path={`${DOCS_ROOT}/Pairs.tsx`}>
                <PairsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.onlyNearbySlidesBuilt} />

            <PageDocsExample path={`${DOCS_ROOT}/Windowed.tsx`}>
                <WindowedDocsExample />
            </PageDocsExample>
        </>
    );
};

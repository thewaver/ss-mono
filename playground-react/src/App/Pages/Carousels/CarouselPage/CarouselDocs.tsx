import { useState } from "react";

import { CAROUSEL_DEFAULTS, CAROUSEL_ORIENTATIONS, CarouselPlacements } from "@thewaver/ss-components-react";
import type { CarouselOrientation } from "@thewaver/ss-components-react";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
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
                        <PageProp
                            itemKey={"transitionDurationMs"}
                            label={"Transition duration (ms)"}
                            hint={
                                "How long the move from one slide to the next takes. At 0 the carousel jumps straight there."
                            }
                            controls={"Sets CarouselProps.transitionDurationMs"}
                        >
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

                        <PageProp
                            itemKey={"orientation"}
                            label={"Orientation"}
                            hint={"Which way the slides run and a swipe moves them: across, or up and down."}
                            controls={"Sets CarouselProps.orientation"}
                        >
                            <PageSelectField
                                value={orientation}
                                values={CAROUSEL_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the carousel off, so neither its controller nor its swipes do anything."}
                            controls={"Sets CarouselProps.isDisabled"}
                        >
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

            <PageDocsSection
                title={"Looks"}
                content={
                    "Where each slide is drawn is decided by [prop]placement[/prop], a rule that is told how far a slide is from the one showing and answers where to put it. The ready-made rules in CarouselPlacementUtils — a strip, a drum, cover flow and the rest — each come with a create function to tune it, and every one follows the orientation. Cover flow and depth wave draw their slides narrower than the box, so they take a [prop]faceRatio[/prop] saying how much of the box a slide's content fills."
                }
            />

            <PageDocsAlert severity={"info"}>
                The looks here are only examples. Any rule you write can be the{" "}
                <span className={docsStyles.docsPropName}>placement</span>: a function told how far a slide is from the
                one showing that answers where to draw it, so the layout is entirely yours.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Looks.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"placement"}
                            label={"Placement"}
                            hint={
                                "The rule that says where each slide is drawn from how far it is from the one showing."
                            }
                            controls={"Picks the rule sent to CarouselProps.placement"}
                        >
                            <PageSelectField
                                value={placement}
                                values={CarouselPlacements.SAMPLE_KEYS}
                                width={PLACEMENT_FIELD_WIDTH}
                                ariaLabel={"Placement"}
                                onChange={setPlacement}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"orientation"}
                            label={"Orientation"}
                            hint={"Which way the slides run. Every rule lays its slides out along it."}
                            controls={"Sets CarouselProps.orientation"}
                        >
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

            <PageDocsSection
                title={"Looping and moving on its own"}
                content={
                    "A carousel loops by default: stepping on from the last slide comes round to the first, the short way. Set [prop]isLooping[/prop] to false and it stops at both ends instead. The controller's [prop]getCanStep[/prop] then answers no at an end, so Previous on the first slide and Next on the last are disabled, and a swipe past an end springs back. Set [prop]autoplayDelayMs[/prop] and the carousel moves to the next slide after each delay; with looping off, it stops for good on the last slide. It holds still while the pointer is over it, while anything inside it has focus, and while the tab is in the background. Whether it is moving is [prop]playback[/prop], which both sides can write, and the controller's [prop]setIsPlaying[/prop] stops and starts it."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Looping.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"isLooping"}
                            label={"Looping"}
                            hint={"Whether stepping on from the last slide comes round to the first."}
                            controls={"Sets CarouselProps.isLooping"}
                        >
                            <PageCheckField value={isLooping} ariaLabel={"Looping"} onChange={setIsLooping} />
                        </PageProp>

                        <PageProp
                            itemKey={"autoplayDelayMs"}
                            label={"Delay (ms)"}
                            hint={"How long a slide is held before the carousel moves to the next one on its own."}
                            controls={"Sets CarouselProps.autoplayDelayMs"}
                        >
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

            <PageDocsSection
                title={"Driven from outside"}
                content={
                    "A [prop]progress[/prop] from 0 to 1 places the carousel anywhere from the first slide to the last, and the slide showing follows whichever is nearest. Here the box's scroll writes it, so scrolling moves the slides with it."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Scrolled.tsx`}>
                <ScrolledDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Several slides to a stop"}
                content={
                    "Pass [prop]computeGroups[/prop] and the slides are split into groups that rest on screen together, here two at a time. Stepping, the dots and [prop]index[/prop] then count groups, and every placement lays a group out in the room of one slide. It comes with [prop]computeGroupLabel[/prop], which names each group when the carousel announces it."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Pairs.tsx`}>
                <PairsDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Only the nearby slides built"}
                content={
                    "Set [prop]isWindowed[/prop] and a slide is built only while it is close enough for the placement to draw it, so a hundred slides cost what a handful do. A slide that comes back is built again from nothing, losing anything it held, such as text typed into it, which is why it is off by default."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Windowed.tsx`}>
                <WindowedDocsExample />
            </PageDocsExample>
        </>
    );
};

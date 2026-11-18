import { createMemo, createSignal } from "solid-js";

import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components-solid";
import { HoverCardKnobs } from "@thewaver/ss-playground/App/Knobs/HoverCards.const";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";

export const HoverCardDocs = () => {
    const [getOffsetY, setOffsetY] = createSignal(HoverCardKnobs.STARTING_OFFSET_Y);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(HOVER_CARD_DEFAULTS.transitionDurationMs);
    const [getFocusShowDelayMs, setFocusShowDelayMs] = createSignal(HOVER_CARD_DEFAULTS.focusShowDelayMs);
    const [getHoverShowDelayMs, setHoverShowDelayMs] = createSignal(HOVER_CARD_DEFAULTS.hoverShowDelayMs);

    const getOffset = createMemo(() => ({ x: 0, y: getOffsetY() }));

    return (
        <PageDocsExample
            path={`${DOCS_ROOT}/Basic.tsx`}
            renderKnobs={() => (
                <>
                    <PageProp key={"offsetY"} {...HoverCardKnobs.OFFSET_Y_TEXT}>
                        <PageNumberField
                            value={getOffsetY}
                            min={HoverCardKnobs.MIN_OFFSET}
                            max={HoverCardKnobs.MAX_OFFSET}
                            step={HoverCardKnobs.OFFSET_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Offset down"}
                            onInput={setOffsetY}
                        />
                    </PageProp>

                    <PageProp key={"transitionDurationMs"} {...HoverCardKnobs.TRANSITION_DURATION_MS_TEXT}>
                        <PageNumberField
                            value={getTransitionDurationMs}
                            min={HoverCardKnobs.MIN_DURATION}
                            max={HoverCardKnobs.MAX_DURATION}
                            step={HoverCardKnobs.DURATION_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Transition duration in milliseconds"}
                            onInput={setTransitionDurationMs}
                        />
                    </PageProp>

                    <PageProp key={"focusShowDelayMs"} {...HoverCardKnobs.FOCUS_SHOW_DELAY_MS_TEXT}>
                        <PageNumberField
                            value={getFocusShowDelayMs}
                            min={HoverCardKnobs.MIN_DURATION}
                            max={HoverCardKnobs.MAX_DURATION}
                            step={HoverCardKnobs.DURATION_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Focus delay in milliseconds"}
                            onInput={setFocusShowDelayMs}
                        />
                    </PageProp>

                    <PageProp key={"hoverShowDelayMs"} {...HoverCardKnobs.HOVER_SHOW_DELAY_MS_TEXT}>
                        <PageNumberField
                            value={getHoverShowDelayMs}
                            min={HoverCardKnobs.MIN_DURATION}
                            max={HoverCardKnobs.MAX_DURATION}
                            step={HoverCardKnobs.DURATION_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Hover delay in milliseconds"}
                            onInput={setHoverShowDelayMs}
                        />
                    </PageProp>
                </>
            )}
        >
            <BasicDocsExample
                offset={getOffset}
                transitionDurationMs={getTransitionDurationMs}
                focusShowDelayMs={getFocusShowDelayMs}
                hoverShowDelayMs={getHoverShowDelayMs}
            />
        </PageDocsExample>
    );
};

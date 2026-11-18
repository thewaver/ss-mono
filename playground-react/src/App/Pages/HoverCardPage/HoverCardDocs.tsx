import { useMemo, useState } from "react";

import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components-react";
import { HoverCardKnobs } from "@thewaver/ss-playground/App/Knobs/HoverCards.const";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";

export const HoverCardDocs = () => {
    const [offsetY, setOffsetY] = useState(HoverCardKnobs.STARTING_OFFSET_Y);
    const [transitionDurationMs, setTransitionDurationMs] = useState(HOVER_CARD_DEFAULTS.transitionDurationMs);
    const [focusShowDelayMs, setFocusShowDelayMs] = useState(HOVER_CARD_DEFAULTS.focusShowDelayMs);
    const [hoverShowDelayMs, setHoverShowDelayMs] = useState(HOVER_CARD_DEFAULTS.hoverShowDelayMs);

    const offset = useMemo(() => ({ x: 0, y: offsetY }), [offsetY]);

    return (
        <PageDocsExample
            path={`${DOCS_ROOT}/Basic.tsx`}
            renderKnobs={() => (
                <>
                    <PageProp itemKey={"offsetY"} {...HoverCardKnobs.OFFSET_Y_TEXT}>
                        <PageNumberField
                            value={offsetY}
                            min={HoverCardKnobs.MIN_OFFSET}
                            max={HoverCardKnobs.MAX_OFFSET}
                            step={HoverCardKnobs.OFFSET_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Offset down"}
                            onInput={setOffsetY}
                        />
                    </PageProp>

                    <PageProp itemKey={"transitionDurationMs"} {...HoverCardKnobs.TRANSITION_DURATION_MS_TEXT}>
                        <PageNumberField
                            value={transitionDurationMs}
                            min={HoverCardKnobs.MIN_DURATION}
                            max={HoverCardKnobs.MAX_DURATION}
                            step={HoverCardKnobs.DURATION_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Transition duration in milliseconds"}
                            onInput={setTransitionDurationMs}
                        />
                    </PageProp>

                    <PageProp itemKey={"focusShowDelayMs"} {...HoverCardKnobs.FOCUS_SHOW_DELAY_MS_TEXT}>
                        <PageNumberField
                            value={focusShowDelayMs}
                            min={HoverCardKnobs.MIN_DURATION}
                            max={HoverCardKnobs.MAX_DURATION}
                            step={HoverCardKnobs.DURATION_STEP}
                            width={FIELD_WIDTH}
                            ariaLabel={"Focus delay in milliseconds"}
                            onInput={setFocusShowDelayMs}
                        />
                    </PageProp>

                    <PageProp itemKey={"hoverShowDelayMs"} {...HoverCardKnobs.HOVER_SHOW_DELAY_MS_TEXT}>
                        <PageNumberField
                            value={hoverShowDelayMs}
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
                offset={offset}
                transitionDurationMs={transitionDurationMs}
                focusShowDelayMs={focusShowDelayMs}
                hoverShowDelayMs={hoverShowDelayMs}
            />
        </PageDocsExample>
    );
};

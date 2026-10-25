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
                    <PageProp
                        itemKey={"offsetY"}
                        label={"Offset down (px)"}
                        hint={
                            "How far the card is held clear of its anchor. The gap is bridged, so the pointer can cross it without losing the card."
                        }
                        controls={"Sets HoverCardProps.offset.y"}
                    >
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

                    <PageProp
                        itemKey={"transitionDurationMs"}
                        label={"Transition duration (ms)"}
                        hint={"How long the card takes to fade in and out."}
                        controls={"Sets HoverCardProps.transitionDurationMs"}
                    >
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

                    <PageProp
                        itemKey={"focusShowDelayMs"}
                        label={"Focus delay (ms)"}
                        hint={"How long a keyboard focus has to rest on the anchor before the card opens."}
                        controls={"Sets HoverCardProps.focusShowDelayMs"}
                    >
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

                    <PageProp
                        itemKey={"hoverShowDelayMs"}
                        label={"Hover delay (ms)"}
                        hint={
                            "How long the pointer has to rest on the anchor before the card opens. Leave before then and nothing opens."
                        }
                        controls={"Sets HoverCardProps.hoverShowDelayMs"}
                    >
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

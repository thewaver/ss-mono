import { createMemo, createSignal } from "solid-js";

import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components-solid";
import { HoverCardKnobs } from "@thewaver/ss-playground/App/Knobs/HoverCards.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ProfileExample } from "./Examples/Profile";
import type { HoverCardExampleProps } from "./HoverCardPageSolid.types";

export const HoverCardPage = () => {
    const [getOffsetY, setOffsetY] = createSignal(HoverCardKnobs.STARTING_OFFSET_Y);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(HOVER_CARD_DEFAULTS.transitionDurationMs);
    const [getFocusShowDelayMs, setFocusShowDelayMs] = createSignal(HOVER_CARD_DEFAULTS.focusShowDelayMs);
    const [getHoverShowDelayMs, setHoverShowDelayMs] = createSignal(HOVER_CARD_DEFAULTS.hoverShowDelayMs);
    const [getSkipDelayWindowMs, setSkipDelayWindowMs] = createSignal(HOVER_CARD_DEFAULTS.skipDelayWindowMs);

    const visibilitySignal = createSignal(false);
    const followingSignal = createSignal(false);

    const getOffset = createMemo(() => ({ x: 0, y: getOffsetY() }));

    const getExamples = createMemo(() => {
        const commonProps: HoverCardExampleProps = {
            offset: getOffset,
            transitionDurationMs: getTransitionDurationMs,
            focusShowDelayMs: getFocusShowDelayMs,
            hoverShowDelayMs: getHoverShowDelayMs,
            skipDelayWindowMs: getSkipDelayWindowMs,
            visibility: visibilitySignal,
            following: followingSignal,
        };

        return [
            {
                key: "profile",
                name: EXAMPLE_NAMES.profile,
                readout: () =>
                    `open: ${visibilitySignal[0]()}, following: ${followingSignal[0]()} — rest on the name, or tab to it and wait, then Tab again to reach the button and the link; Escape brings focus back to the name`,
                component: () => <ProfileExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Profile.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"offsetY"}
                    label={"Offset down (px)"}
                    hint={
                        "How far the card is held clear of its anchor. The gap is bridged, so the pointer can cross it without losing the card."
                    }
                >
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

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Fade (ms)"}
                    hint={"How long the card takes to fade in and out."}
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={HoverCardKnobs.MIN_DURATION}
                        max={HoverCardKnobs.MAX_DURATION}
                        step={HoverCardKnobs.DURATION_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Fade in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"focusShowDelayMs"}
                    label={"Focus delay (ms)"}
                    hint={"How long a keyboard focus has to rest on the anchor before the card opens."}
                >
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

                <PageProp
                    key={"hoverShowDelayMs"}
                    label={"Hover delay (ms)"}
                    hint={
                        "How long the pointer has to rest on the anchor before the card opens. Leave before then and nothing opens."
                    }
                >
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

                <PageProp
                    key={"skipDelayWindowMs"}
                    label={"Skip window (ms)"}
                    hint={
                        "How soon after a card has closed a hover opens one again at once, without waiting out the hover delay."
                    }
                >
                    <PageNumberField
                        value={getSkipDelayWindowMs}
                        min={HoverCardKnobs.MIN_DURATION}
                        max={HoverCardKnobs.MAX_DURATION}
                        step={HoverCardKnobs.DURATION_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Skip window in milliseconds"}
                        onInput={setSkipDelayWindowMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};

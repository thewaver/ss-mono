import { createMemo, createSignal } from "solid-js";

import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { NavigationMenuExample } from "./Examples/NavigationMenu";
import { ProfileExample } from "./Examples/Profile";
import type { HoverCardExampleProps, NavigationMenuExampleProps } from "./HoverCardPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/HoverCardPage/Examples";

const MIN_OFFSET = 0;
const MAX_OFFSET = 40;
const OFFSET_STEP = 2;
const MIN_DURATION = 0;
const MAX_DURATION = 1000;
const DURATION_STEP = 50;
const FIELD_WIDTH = 110;

const STARTING_OFFSET_Y = 8;

export const HoverCardPage = () => {
    const [getOffsetY, setOffsetY] = createSignal(STARTING_OFFSET_Y);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(HOVER_CARD_DEFAULTS.transitionDurationMs);
    const [getFocusShowDelayMs, setFocusShowDelayMs] = createSignal(HOVER_CARD_DEFAULTS.focusShowDelayMs);
    const [getHoverShowDelayMs, setHoverShowDelayMs] = createSignal(HOVER_CARD_DEFAULTS.hoverShowDelayMs);
    const [getSkipDelayWindowMs, setSkipDelayWindowMs] = createSignal(HOVER_CARD_DEFAULTS.skipDelayWindowMs);

    const visibilitySignal = createSignal(false);
    const followingSignal = createSignal(false);
    const openKeySignal = createSignal<string | undefined>();

    const getOffset = createMemo(() => ({ x: 0, y: getOffsetY() }));

    const getExamples = createMemo(() => {
        const commonProps: HoverCardExampleProps = {
            offset: getOffset,
            transitionDurationMs: getTransitionDurationMs,
            focusShowDelayMs: getFocusShowDelayMs,
            hoverShowDelayMs: getHoverShowDelayMs,
            skipDelayWindowMs: getSkipDelayWindowMs,
            visibilitySignal,
            followingSignal,
        };

        const navigationProps: NavigationMenuExampleProps = {
            hoverShowDelayMs: getHoverShowDelayMs,
            skipDelayWindowMs: getSkipDelayWindowMs,
            openKeySignal,
        };

        return [
            {
                key: "profile",
                name: "A profile card",
                readout: () =>
                    `open: ${visibilitySignal[0]()}, following: ${followingSignal[0]()} — rest on the name, or tab to it and wait, then Tab again to reach the button and the link; Escape brings focus back to the name`,
                component: () => <ProfileExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Profile.tsx`,
            },
            {
                key: "navigation",
                name: "A navigation menu",
                readout: () =>
                    `open: ${openKeySignal[0]() ?? "none"} — each flyout is a popup trigger over a popover, opened by a press or by resting on it through the same hover engine; only one is open at a time`,
                component: () => <NavigationMenuExample {...navigationProps} />,
                path: `${EXAMPLES_ROOT}/NavigationMenu.tsx`,
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
                        min={() => MIN_OFFSET}
                        max={() => MAX_OFFSET}
                        step={() => OFFSET_STEP}
                        width={() => FIELD_WIDTH}
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
                        min={() => MIN_DURATION}
                        max={() => MAX_DURATION}
                        step={() => DURATION_STEP}
                        width={() => FIELD_WIDTH}
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
                        min={() => MIN_DURATION}
                        max={() => MAX_DURATION}
                        step={() => DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Focus delay in milliseconds"}
                        onInput={setFocusShowDelayMs}
                    />
                </PageProp>

                <PageProp
                    key={"hoverShowDelayMs"}
                    label={"Hover delay (ms)"}
                    hint={
                        "How long the pointer has to rest on the anchor before the card or a flyout opens. Leave before then and nothing opens."
                    }
                >
                    <PageNumberField
                        value={getHoverShowDelayMs}
                        min={() => MIN_DURATION}
                        max={() => MAX_DURATION}
                        step={() => DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Hover delay in milliseconds"}
                        onInput={setHoverShowDelayMs}
                    />
                </PageProp>

                <PageProp
                    key={"skipDelayWindowMs"}
                    label={"Skip window (ms)"}
                    hint={
                        "How soon after one closes a hover opens the next at once. Open one flyout, then move to the other."
                    }
                >
                    <PageNumberField
                        value={getSkipDelayWindowMs}
                        min={() => MIN_DURATION}
                        max={() => MAX_DURATION}
                        step={() => DURATION_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Skip window in milliseconds"}
                        onInput={setSkipDelayWindowMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};

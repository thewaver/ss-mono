import { useMemo, useState } from "react";

import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components-react";
import { HoverCardKnobs } from "@thewaver/ss-playground/App/Knobs/HoverCards.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { NavigationMenuExample } from "./Examples/NavigationMenu";
import { ProfileExample } from "./Examples/Profile";
import type { HoverCardExampleProps, NavigationMenuExampleProps } from "./HoverCardPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/HoverCardPage/Examples";

const FIELD_WIDTH = 110;

export const HoverCardPage = () => {
    const [offsetY, setOffsetY] = useState(HoverCardKnobs.STARTING_OFFSET_Y);
    const [transitionDurationMs, setTransitionDurationMs] = useState(HOVER_CARD_DEFAULTS.transitionDurationMs);
    const [focusShowDelayMs, setFocusShowDelayMs] = useState(HOVER_CARD_DEFAULTS.focusShowDelayMs);
    const [hoverShowDelayMs, setHoverShowDelayMs] = useState(HOVER_CARD_DEFAULTS.hoverShowDelayMs);
    const [skipDelayWindowMs, setSkipDelayWindowMs] = useState(HOVER_CARD_DEFAULTS.skipDelayWindowMs);

    const visibilityState = useState(false);
    const followingState = useState(false);
    const openKeyState = useState<string | undefined>();

    const offset = useMemo(() => ({ x: 0, y: offsetY }), [offsetY]);

    const commonProps: HoverCardExampleProps = {
        offset,
        transitionDurationMs,
        focusShowDelayMs,
        hoverShowDelayMs,
        skipDelayWindowMs,
        visibilityState,
        followingState,
    };

    const navigationProps: NavigationMenuExampleProps = {
        hoverShowDelayMs,
        skipDelayWindowMs,
        openKeyState,
    };

    const examples = [
        {
            key: "profile",
            name: "A profile card",
            readout: () =>
                `open: ${visibilityState[0]}, following: ${followingState[0]} — rest on the name, or tab to it and wait, then Tab again to reach the button and the link; Escape brings focus back to the name`,
            component: () => <ProfileExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Profile.tsx`,
        },
        {
            key: "navigation",
            name: "A navigation menu",
            readout: () =>
                `open: ${openKeyState[0] ?? "none"} — each flyout is a popup trigger over a popover, opened by a press or by resting on it through the same hover engine; only one is open at a time`,
            component: () => <NavigationMenuExample {...navigationProps} />,
            path: `${EXAMPLES_ROOT}/NavigationMenu.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"offsetY"}
                    label={"Offset down (px)"}
                    hint={
                        "How far the card is held clear of its anchor. The gap is bridged, so the pointer can cross it without losing the card."
                    }
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
                    label={"Fade (ms)"}
                    hint={"How long the card takes to fade in and out."}
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={HoverCardKnobs.MIN_DURATION}
                        max={HoverCardKnobs.MAX_DURATION}
                        step={HoverCardKnobs.DURATION_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Fade in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"focusShowDelayMs"}
                    label={"Focus delay (ms)"}
                    hint={"How long a keyboard focus has to rest on the anchor before the card opens."}
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
                        "How long the pointer has to rest on the anchor before the card or a flyout opens. Leave before then and nothing opens."
                    }
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

                <PageProp
                    itemKey={"skipDelayWindowMs"}
                    label={"Skip window (ms)"}
                    hint={
                        "How soon after one closes a hover opens the next at once. Open one flyout, then move to the other."
                    }
                >
                    <PageNumberField
                        value={skipDelayWindowMs}
                        min={HoverCardKnobs.MIN_DURATION}
                        max={HoverCardKnobs.MAX_DURATION}
                        step={HoverCardKnobs.DURATION_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Skip window in milliseconds"}
                        onInput={setSkipDelayWindowMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};

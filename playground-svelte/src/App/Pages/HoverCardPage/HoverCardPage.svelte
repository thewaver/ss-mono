<script lang="ts">
    import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { HoverCardKnobs } from "@thewaver/ss-playground/App/Knobs/HoverCards.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import NavigationMenuExample from "./Examples/NavigationMenu.svelte";
    import ProfileExample from "./Examples/Profile.svelte";
    import type { HoverCardExampleProps, NavigationMenuExampleProps } from "./HoverCardPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/HoverCardPage/Examples";

    const FIELD_WIDTH = 110;

    let offsetY = $state(HoverCardKnobs.STARTING_OFFSET_Y);
    let transitionDurationMs = $state(HOVER_CARD_DEFAULTS.transitionDurationMs);
    let focusShowDelayMs = $state(HOVER_CARD_DEFAULTS.focusShowDelayMs);
    let hoverShowDelayMs = $state(HOVER_CARD_DEFAULTS.hoverShowDelayMs);
    let skipDelayWindowMs = $state(HOVER_CARD_DEFAULTS.skipDelayWindowMs);

    let visibility = $state(false);
    let following = $state(false);
    let openKey = $state<string | undefined>();

    const offset = $derived({ x: 0, y: offsetY });

    const commonProps: Omit<HoverCardExampleProps, "visibility" | "following"> = $derived({
        offset,
        transitionDurationMs,
        focusShowDelayMs,
        hoverShowDelayMs,
        skipDelayWindowMs,
    });

    const navigationProps: Omit<NavigationMenuExampleProps, "openKey"> = $derived({
        hoverShowDelayMs,
        skipDelayWindowMs,
    });

    const examples: ExampleDefs[] = [
        {
            key: "profile",
            name: "A profile card",
            readout: () =>
                `open: ${visibility}, following: ${following} — rest on the name, or tab to it and wait, then Tab again to reach the button and the link; Escape brings focus back to the name`,
            component: profileExample,
            path: `${EXAMPLES_ROOT}/Profile.svelte`,
        },
        {
            key: "navigation",
            name: "A navigation menu",
            readout: () =>
                `open: ${openKey ?? "none"} — each flyout is a popup trigger over a popover, opened by a press or by resting on it through the same hover engine; only one is open at a time`,
            component: navigationExample,
            path: `${EXAMPLES_ROOT}/NavigationMenu.svelte`,
        },
    ];
</script>

{#snippet profileExample()}
    <ProfileExample {...commonProps} bind:visibility bind:following />
{/snippet}

{#snippet navigationExample()}
    <NavigationMenuExample {...navigationProps} bind:openKey />
{/snippet}

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
            onInput={(value) => {
                offsetY = value;
            }}
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
            onInput={(value) => {
                transitionDurationMs = value;
            }}
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
            onInput={(value) => {
                focusShowDelayMs = value;
            }}
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
            onInput={(value) => {
                hoverShowDelayMs = value;
            }}
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
            onInput={(value) => {
                skipDelayWindowMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />

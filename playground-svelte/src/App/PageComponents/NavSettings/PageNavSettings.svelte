<script lang="ts">
    import { EXAMPLES_ONLY_PROP } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";
    import { MediaQueryMonitorSvelteUtils, SHAPE_REVEAL_DEFAULTS, Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import PageExampleKnobsButton from "../ExampleKnobs/PageExampleKnobsButton.svelte";
    import PageSelectField from "../Field/PageSelectField.svelte";
    import PageProp from "../Prop/Prop.svelte";
    import { getAppliedSkin, revealSkin } from "../Skin/SkinSvelte.const.svelte";
    import { getAppliedTheme, revealTheme } from "../Theme/ThemeSvelte.const.svelte";
    import {
        SKIN_FIELD_ID,
        SKIN_OPTIONS,
        THEME_FIELD_ID,
        THEME_OPTIONS,
        VIEWPORT_ANCHOR_OPTIONS,
    } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";
    import { DEFAULT_SKIN } from "@thewaver/ss-playground/App/Skins/Skin.const";
    import type {
        PageNavSettingsProps,
        PlaygroundSkin,
        PlaygroundTheme,
        ViewportAnchor,
    } from "./NavSettingsSvelte.types";
    import { DEFAULT_THEME, NO_MOTION_DURATION_MS } from "@thewaver/ss-playground/App/PageComponents/NavSettings/NavSettings.const";

    const computeViewportAnchorLabel = (anchor: ViewportAnchor) =>
        VIEWPORT_ANCHOR_OPTIONS.find((option) => option.value === anchor)?.label ?? String(anchor);

    const computeThemeLabel = (theme: PlaygroundTheme) =>
        THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme;

    const computeSkinLabel = (skin: PlaygroundSkin) =>
        SKIN_OPTIONS.find((option) => option.value === skin)?.label ?? skin;

    let {
        showsDescriptionOnly = $bindable(),
        viewportAnchor = $bindable(),
    }: PageNavSettingsProps = $props();

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const pickTheme = (nextTheme: PlaygroundTheme) => {
        void revealTheme(nextTheme, {
            origin: document.getElementById(THEME_FIELD_ID) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };

    const pickSkin = (nextSkin: PlaygroundSkin) => {
        void revealSkin(nextSkin, {
            origin: document.getElementById(SKIN_FIELD_ID) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };
</script>

<PageExampleKnobsButton exampleKey={"library"} exampleName={"Library"} renderKnobs={knobs} />

{#snippet knobs()}
    <PageProp
        itemKey={"showsDescriptionOnly"}
        controls={EXAMPLES_ONLY_PROP}
        label={"Show pages without examples"}
        hint={"Lists the pages with no live examples anywhere, only a description and the API, which are hidden otherwise."}
        defaultValue={false}
    >
        <Toggle bind:checked={showsDescriptionOnly} ariaLabel={"Show pages without examples"}>
            {#snippet renderContent(flags)}
                <PageToggleContent {flags} />
            {/snippet}
        </Toggle>
    </PageProp>

    <PageProp
        itemKey={"viewportAnchor"}
        controls={EXAMPLES_ONLY_PROP}
        label={"Viewport anchor"}
        hint={"The height the whole playground is laid out at before it is scaled to fit the window. None lays it out at the window's own size and Auto at the screen's height, both at the window's shape; 1080p and 1440p lay out a fixed 16:9 page of that height, with empty bars around it."}
        defaultValue={"Auto"}
    >
        <PageSelectField
            value={viewportAnchor}
            values={VIEWPORT_ANCHOR_OPTIONS.map((option) => option.value)}
            computeLabel={computeViewportAnchorLabel}
            ariaLabel={"Viewport anchor"}
            onChange={(value) => {
                viewportAnchor = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"theme"}
        controls={EXAMPLES_ONLY_PROP}
        label={"Theme"}
        hint={"Which color theme the playground is drawn in, independent of the framework it runs in. The new theme is uncovered by a circle growing from this field."}
        defaultValue={computeThemeLabel(DEFAULT_THEME)}
    >
        <PageSelectField
            id={THEME_FIELD_ID}
            value={getAppliedTheme()}
            values={THEME_OPTIONS.map((option) => option.value)}
            computeLabel={computeThemeLabel}
            ariaLabel={"Theme"}
            onChange={pickTheme}
        />
    </PageProp>

    <PageProp
        itemKey={"skin"}
        controls={EXAMPLES_ONLY_PROP}
        label={"Skin"}
        hint={"How the playground is drawn: the shapes, borders, shadows and fonts its controls are painted with, and where the theme's colors go. The new skin is uncovered by a circle growing from this field."}
        defaultValue={computeSkinLabel(DEFAULT_SKIN)}
    >
        <PageSelectField
            id={SKIN_FIELD_ID}
            value={getAppliedSkin()}
            values={SKIN_OPTIONS.map((option) => option.value)}
            computeLabel={computeSkinLabel}
            ariaLabel={"Skin"}
            onChange={pickSkin}
        />
    </PageProp>
{/snippet}

<script lang="ts">
    import {
        MediaQueryMonitorSvelteUtils,
        SHAPE_REVEAL_DEFAULTS,
        ShapeRevealUtils,
        Toggle,
    } from "@thewaver/ss-components-svelte";
    import { PLAYGROUND_THEMES } from "@thewaver/ss-playground/App/Theme.css";

    import PageToggleContent from "../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import PageExampleKnobsButton from "../ExampleKnobs/PageExampleKnobsButton.svelte";
    import PageSelectField from "../Field/PageSelectField.svelte";
    import { OWN_FRAMEWORK } from "../FrameworkMenu/FrameworkMenu.const";
    import PageProp from "../Prop/Prop.svelte";
    import { PAGE_VIEW_OPTIONS, THEME_FIELD_ID, THEME_OPTIONS, VIEWPORT_ANCHOR_OPTIONS } from "./NavSettings.const";
    import type { PageNavSettingsProps, PlaygroundTheme, ViewportAnchor } from "./NavSettings.types";
    import PageNavSettingsChoice from "./PageNavSettingsChoice.svelte";

    const NO_MOTION_DURATION_MS = 0;

    const computeViewportAnchorLabel = (anchor: ViewportAnchor) =>
        VIEWPORT_ANCHOR_OPTIONS.find((option) => option.value === anchor)?.label ?? String(anchor);

    const computeThemeLabel = (theme: PlaygroundTheme) =>
        THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme;

    const findAppliedTheme = () =>
        THEME_OPTIONS.find((option) => document.documentElement.classList.contains(PLAYGROUND_THEMES[option.value]))
            ?.value ?? OWN_FRAMEWORK;

    const applyTheme = (theme: PlaygroundTheme) => {
        document.documentElement.classList.remove(...Object.values(PLAYGROUND_THEMES));
        document.documentElement.classList.add(PLAYGROUND_THEMES[theme]);
    };

    let {
        showsDescriptionOnly = $bindable(),
        pageView = $bindable(),
        viewportAnchor = $bindable(),
    }: PageNavSettingsProps = $props();

    let theme = $state<PlaygroundTheme>(findAppliedTheme());

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const pickTheme = (nextTheme: PlaygroundTheme) => {
        theme = nextTheme;

        void ShapeRevealUtils.reveal(() => applyTheme(nextTheme), {
            origin: document.getElementById(THEME_FIELD_ID) ?? SHAPE_REVEAL_DEFAULTS.origin,
            durationMs: getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : SHAPE_REVEAL_DEFAULTS.durationMs,
        });
    };
</script>

<PageExampleKnobsButton exampleKey={"library"} exampleName={"Library"} renderKnobs={knobs} />

{#snippet knobs()}
    <PageProp
        itemKey={"showsDescriptionOnly"}
        label={"Show pages without examples"}
        hint={"Lists the pages that have docs but no examples yet, which are hidden otherwise."}
        defaultValue={false}
    >
        <Toggle bind:checked={showsDescriptionOnly} ariaLabel={"Show pages without examples"}>
            {#snippet renderContent(flags)}
                <PageToggleContent {flags} />
            {/snippet}
        </Toggle>
    </PageProp>

    <PageProp
        itemKey={"pageView"}
        label={"Open pages on"}
        hint={"Which tab a page opens on when it is picked from the list. A page with no examples always opens on its docs."}
        defaultValue={"Examples"}
    >
        <PageNavSettingsChoice ariaLabel={"Open pages on"} options={PAGE_VIEW_OPTIONS} bind:value={pageView} />
    </PageProp>

    <PageProp
        itemKey={"viewportAnchor"}
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
        label={"Theme"}
        hint={"Which color theme the playground is drawn in, independent of the framework it runs in. The new theme is uncovered by a circle growing from this field."}
        defaultValue={computeThemeLabel(OWN_FRAMEWORK)}
    >
        <PageSelectField
            id={THEME_FIELD_ID}
            value={theme}
            values={THEME_OPTIONS.map((option) => option.value)}
            computeLabel={computeThemeLabel}
            ariaLabel={"Theme"}
            onChange={pickTheme}
        />
    </PageProp>
{/snippet}

<script lang="ts">
    import { untrack } from "svelte";

    import { Button, ColorArea, Popover, Range } from "@thewaver/ss-components-svelte";
    import { COLOR_AREA_AXIS_LABELS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { STARTING_PICKER_HSV } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";
    import { Color } from "@thewaver/ss-utils";

    import PageColorChannels from "../../../PageComponents/ColorChannels/ColorChannels.svelte";
    import PageColorAreaContent from "../../../StyledComponents/ColorAreaContent/PageColorAreaContent.svelte";
    import PageColorFieldTrigger from "../../../StyledComponents/ColorAreaContent/PageColorFieldTrigger.svelte";
    import PageColorPickerPopup from "../../../StyledComponents/ColorAreaContent/PageColorPickerPopup.svelte";
    import PageColorPickerRow from "../../../StyledComponents/ColorAreaContent/PageColorPickerRow.svelte";
    import PageColorPreview from "../../../StyledComponents/ColorAreaContent/PageColorPreview.svelte";
    import PageColorSwatch from "../../../StyledComponents/ColorAreaContent/PageColorSwatch.svelte";
    import PageHueSlider from "../../../StyledComponents/ColorAreaContent/PageHueSlider.svelte";

    const AREA_SIZE = 160;
    const HUE_THUMB_SIZE = 18;
    const HUE_MAX = 360;

    const popupId = $props.id();

    let hsv = $state.raw<Color.HSVA>(STARTING_PICKER_HSV);
    let hue = $state(STARTING_PICKER_HSV.h);

    let triggerRef = $state<HTMLElement>();
    let isOpen = $state(false);

    const css = $derived(Color.RGBA.toCss(Color.HSVA.toRgba(hsv)));

    $effect(() => {
        const nextHue = hsv.h;

        untrack(() => {
            if (hue === nextHue) return;

            hue = nextHue;
        });
    });

    $effect(() => {
        const nextHue = hue;

        untrack(() => {
            if (hsv.h === nextHue) return;

            hsv = { ...hsv, h: nextHue };
        });
    });
</script>

<Button
    bind:ref={triggerRef}
    ariaHasPopup={"dialog"}
    ariaExpanded={isOpen}
    onClick={() => {
        isOpen = !isOpen;
    }}
>
    {#snippet renderContent(flags)}
        <PageColorFieldTrigger {flags}>
            <PageColorSwatch value={css} />
            {Color.HSVA.toHexa(hsv)}
        </PageColorFieldTrigger>
    {/snippet}
</Button>

<Popover
    id={popupId}
    role={"dialog"}
    ariaAttributes={{ "aria-label": "Choose a color" }}
    {isOpen}
    anchorRef={triggerRef}
    hasAutoFocus={true}
    offset={{ x: 0, y: 5 }}
    onDismiss={(reason) => {
        isOpen = false;

        if (reason === "escape") triggerRef?.focus();
    }}
>
    {#snippet renderContent()}
        <PageColorPickerPopup>
            <PageColorPreview value={css} />

            <ColorArea
                bind:hsv
                sizing={"fill"}
                ariaLabel={"Saturation and brightness"}
                axisLabels={COLOR_AREA_AXIS_LABELS}
            >
                {#snippet renderContent(renderProps)}
                    <PageColorAreaContent {renderProps} size={AREA_SIZE} />
                {/snippet}
            </ColorArea>

            <PageColorPickerRow>
                <Range
                    bind:value={hue}
                    sizing={"fill"}
                    max={HUE_MAX}
                    step={1}
                    id={"hueSlider"}
                    ariaLabel={"Hue"}
                    thumbSize={HUE_THUMB_SIZE}
                >
                    {#snippet renderContent(renderProps)}
                        <PageHueSlider {renderProps} />
                    {/snippet}
                </Range>
            </PageColorPickerRow>

            <PageColorChannels hsv={[() => hsv, (next) => (hsv = next)]} />
        </PageColorPickerPopup>
    {/snippet}
</Popover>

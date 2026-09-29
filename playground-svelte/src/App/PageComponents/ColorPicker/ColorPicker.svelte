<script module lang="ts">
    import type { Snippet } from "svelte";

    import type {
        ColorAreaRenderProps,
        InteractionFlags,
        RangeRenderProps,
        ValuePair,
    } from "@thewaver/ss-components-svelte";
    import { Color } from "@thewaver/ss-utils";

    import PageColorAreaContent from "../../StyledComponents/ColorAreaContent/PageColorAreaContent.svelte";
    import PageColorPickerPopup from "../../StyledComponents/ColorAreaContent/PageColorPickerPopup.svelte";
    import PageColorPreview from "../../StyledComponents/ColorAreaContent/PageColorPreview.svelte";
    import PageHueSlider from "../../StyledComponents/ColorAreaContent/PageHueSlider.svelte";
    import PageColorChannels from "../ColorChannels/ColorChannels.svelte";

    const AREA_SIZE = 160;

    export const pageColorPickerSlots = {
        renderArea,
        renderHue,
        renderPopup,
    };
</script>

{#snippet renderArea(renderProps: InteractionFlags<ColorAreaRenderProps>)}
    <PageColorAreaContent {renderProps} size={AREA_SIZE} />
{/snippet}

{#snippet renderHue(renderProps: InteractionFlags<RangeRenderProps>)}
    <PageHueSlider {renderProps} />
{/snippet}

{#snippet renderPopup(renderSurface: Snippet, hsv: ValuePair<Color.HSVA>)}
    <PageColorPickerPopup>
        <PageColorPreview value={Color.RGBA.toCss(Color.HSVA.toRgba(hsv[0]()))} />

        {@render renderSurface()}

        <PageColorChannels {hsv} />
    </PageColorPickerPopup>
{/snippet}

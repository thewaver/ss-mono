<script lang="ts">
    import { untrack } from "svelte";

    import { Button, Popover, Range } from "@thewaver/ss-components-svelte";
    import { Color } from "@thewaver/ss-utils";

    import PageColorChannels from "../../../PageComponents/ColorChannels/ColorChannels.svelte";
    import PageColorFieldTrigger from "../../../StyledComponents/ColorAreaContent/PageColorFieldTrigger.svelte";
    import PageColorPickerPopup from "../../../StyledComponents/ColorAreaContent/PageColorPickerPopup.svelte";
    import PageColorPickerRow from "../../../StyledComponents/ColorAreaContent/PageColorPickerRow.svelte";
    import PageColorPreview from "../../../StyledComponents/ColorAreaContent/PageColorPreview.svelte";
    import PageColorSwatch from "../../../StyledComponents/ColorAreaContent/PageColorSwatch.svelte";
    import PageHueSlider from "../../../StyledComponents/ColorAreaContent/PageHueSlider.svelte";
    import type { ColorAreaDropdownExampleProps } from "../ColorAreaPage.types";
    import SurfaceExample from "./Surface.svelte";

    const HUE_THUMB_SIZE = 18;
    const HUE_MAX = 360;

    type Props = ColorAreaDropdownExampleProps;

    let { hsv = $bindable(), isOpen = $bindable(), hue = $bindable(), ...props }: Props = $props();

    let triggerRef = $state<HTMLElement>();

    const css = $derived(Color.RGBA.toCss(Color.HSVA.toRgba(hsv)));

    const hexa = $derived(Color.HSVA.toHexa(hsv));

    $effect(() => {
        if (!isOpen) return;

        const popupId = props.popupId;
        const trigger = triggerRef;

        const handlePointerDown = (e: PointerEvent) => {
            const target = e.target as Node | null;

            if (!target) return;
            if (document.getElementById(popupId)?.contains(target)) return;
            if (trigger?.contains(target)) return;

            isOpen = false;
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    });

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
    onClick={() => {
        isOpen = !isOpen;
    }}
>
    {#snippet renderContent(flags)}
        <PageColorFieldTrigger {flags}>
            <PageColorSwatch value={css} />
            {hexa}
        </PageColorFieldTrigger>
    {/snippet}
</Button>

<Popover
    id={props.popupId}
    role={"dialog"}
    ariaAttributes={{ "aria-label": "Choose a color" }}
    {isOpen}
    anchorRef={triggerRef}
    hasAutoFocus={true}
    offset={{ x: 0, y: 5 }}
    onKeyDown={(e) => {
        if (e.key !== "Escape") return;

        isOpen = false;
        triggerRef?.focus();
    }}
>
    {#snippet renderContent()}
        <PageColorPickerPopup>
            <PageColorPreview value={css} />

            <SurfaceExample bind:hsv />

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

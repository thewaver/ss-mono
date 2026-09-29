<script lang="ts">
    import { CAROUSEL_ORIENTATIONS } from "@thewaver/ss-components-svelte";
    import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
    import {
        FIELD_WIDTH,
        ORIENTATION_FIELD_WIDTH,
        ORIENTATION_LABELS,
    } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import type { CarouselsControls } from "./Carousels.types";

    type Props = {
        controls: CarouselsControls;
        hasDelay?: boolean;
        hasLooping?: boolean;
    };

    let props: Props = $props();

    const controls = $derived(props.controls);
</script>

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"slideCount"} label={"Slide count"} hint={"How many slides the carousel holds."}>
        <PageNumberField
            value={controls.slideCount}
            min={CarouselKnobs.MIN_SLIDE_COUNT}
            max={CarouselKnobs.MAX_SLIDE_COUNT}
            step={CarouselKnobs.SLIDE_COUNT_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Slide count"}
            onInput={(value) => {
                controls.slideCount = value;
            }}
        />
    </PageProp>

    {#if props.hasDelay}
        <PageProp
            itemKey={"delayMs"}
            label={"RotatorUtils delay (ms)"}
            hint={"How long a slide is held before the carousel moves to the next one on its own."}
        >
            <PageNumberField
                value={controls.delay}
                min={CarouselKnobs.MIN_DELAY_MS}
                max={CarouselKnobs.MAX_DELAY_MS}
                step={CarouselKnobs.DELAY_STEP_MS}
                width={FIELD_WIDTH}
                ariaLabel={"RotatorUtils delay in milliseconds"}
                onInput={(value) => {
                    controls.delay = value;
                }}
            />
        </PageProp>
    {/if}

    <PageProp
        itemKey={"orientation"}
        label={"Orientation"}
        hint={"Which way the slides run, and so which way the arrows and the arrow keys move."}
    >
        <PageSelectField
            value={controls.orientation}
            values={CAROUSEL_ORIENTATIONS}
            computeLabel={(orientation) => ORIENTATION_LABELS[orientation]}
            width={ORIENTATION_FIELD_WIDTH}
            ariaLabel={"Orientation"}
            onChange={(orientation) => {
                controls.orientation = orientation;
            }}
        />
    </PageProp>

    {#if props.hasLooping}
        <PageProp
            itemKey={"isLooping"}
            label={"Looping"}
            hint={
                "Whether stepping past the last slide comes round to the first. Off, the end controls are disabled, a swipe past an end springs back, and rotation stops on the last slide."
            }
        >
            <PageCheckField
                value={controls.isLooping}
                ariaLabel={"Looping"}
                onChange={(value) => {
                    controls.isLooping = value;
                }}
            />
        </PageProp>
    {/if}

    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Turns the carousel off, so neither its controls nor its swipes do anything."}
    >
        <PageCheckField
            value={controls.isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                controls.isDisabled = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

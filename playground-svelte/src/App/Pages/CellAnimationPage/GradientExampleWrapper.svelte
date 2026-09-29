<script lang="ts">
    import { CellAnimationPlaybackUtils } from "@thewaver/ss-components-svelte";
    import type { SVGDefsSamples } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
    import type { Size2d } from "@thewaver/ss-utils";

    import { CellAnimationKnobs } from "../../Knobs/CellAnimations.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import { SVGDefsSources } from "../../PageComponents/SVGDefsSources/SVGDefsSources.const";
    import type { CellAnimationExampleProps } from "./CellAnimationPage.types";
    import DefaultExample from "./Examples/Default.svelte";

    const IMAGE_CONTAINER_SIZE = 480;

    const computeContainerWidth = (size: Size2d) =>
        (IMAGE_CONTAINER_SIZE * size.width) / Math.max(size.width, size.height);

    type Props = CellAnimationExampleProps;

    let { playback = $bindable(), ...props }: Props = $props();

    let key = $state<SVGDefsSamples.Gradient.Timed.SampleKey>(CellAnimationKnobs.STARTING_GRADIENT_KEY);
    let ratio = $state<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

    const size = $derived(SVGDefsSources.computeSourceSize(ratio));

    const cycleDurationMs = $derived(
        CellAnimationPlaybackUtils.computeCycleDurationMs(props.animationDurationMs, props.playbackOpts),
    );

    const src = $derived(
        SVGDefsSources.computeGradientSource(key, size, cycleDurationMs, props.animationIterationDelayMs),
    );
</script>

<div class={styles.exampleRoot}>
    <PageMeasureBox width={computeContainerWidth(size)}>
        <DefaultExample {...props} bind:playback {src} />
    </PageMeasureBox>
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"gradient"}
        label={"Gradient"}
        hint={"Which animated gradient is rendered into the picture the cells are cut from."}
    >
        <PageSelectField
            value={key}
            values={SVGDefsSources.GRADIENT_KEYS}
            ariaLabel={"Gradient"}
            onChange={(next) => {
                key = next;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"gradientRatio"}
        label={"Ratio"}
        hint={"The shape of the picture the gradient is drawn into, which decides how the cells are proportioned."}
    >
        <PageSelectField
            value={ratio}
            values={SVGDefsSources.SOURCE_RATIOS}
            ariaLabel={"Gradient ratio"}
            onChange={(next) => {
                ratio = next;
            }}
        />
    </PageProp>
</PageExampleKnobs>

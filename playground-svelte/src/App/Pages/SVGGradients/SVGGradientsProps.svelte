<script lang="ts">
    import type { SVGDefsColors } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";

    import { SVGGradientKnobs } from "../../Knobs/SVGGradients.const";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { SVGGradientsControls } from "./SVGGradients.types";

    type Props = {
        controls: SVGGradientsControls;
    };

    let props: Props = $props();

    const controls = $derived(props.controls);
</script>

<PageProp
    itemKey={"paintKind"}
    label={"Painted as"}
    hint={"Whether the gradient paints the inside of the sample shape or only its outline."}
>
    <PageSelectField
        value={controls.paintKind[0]()}
        values={SVGGradientKnobs.PAINT_KINDS}
        ariaLabel={"Painted as"}
        onChange={(kind) => controls.paintKind[1](kind)}
    />
</PageProp>

<PageProp
    itemKey={"colors"}
    label={"Colors"}
    hint={"The colors the gradient is built from. Each sample uses as many of them as it needs."}
>
    <div class={styles.colorList}>
        {#each Object.keys(controls.colors) as key (key)}
            <PageColorField
                value={controls.colors[key as keyof SVGDefsColors]}
                ariaLabel={key}
                onInput={(value) => controls.setColor(key as keyof SVGDefsColors, value)}
            />
        {/each}
    </div>
</PageProp>

<PageProp
    itemKey={"blurWidth"}
    label={"Blur (px)"}
    hint={"How far the paint is blurred outward, which is what gives it its glow."}
>
    <PageNumberField
        value={controls.blurWidth[0]()}
        min={SVGGradientKnobs.MIN_BLUR_WIDTH}
        max={SVGGradientKnobs.MAX_BLUR_WIDTH}
        step={SVGGradientKnobs.BLUR_WIDTH_STEP}
        ariaLabel={"Blur width"}
        onInput={controls.blurWidth[1]}
    />
</PageProp>

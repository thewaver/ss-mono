<script lang="ts">
    import type { SVGDefsColors } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";

    import { SVGPatternKnobs } from "../../Knobs/SVGPatterns.const";
    import PageColorField from "../../PageComponents/Field/PageColorField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { SVGPatternsControls } from "./SVGPatterns.types";

    type Props = {
        controls: SVGPatternsControls;
    };

    let props: Props = $props();

    const controls = $derived(props.controls);
</script>

<PageProp itemKey={"cellSize"} label={"Cell Size (px)"} hint={"How large one cell of the pattern is."}>
    <PageNumberField
        value={controls.cellSize[0]()}
        min={SVGPatternKnobs.MIN_CELL_SIZE}
        max={SVGPatternKnobs.MAX_CELL_SIZE}
        step={SVGPatternKnobs.CELL_SIZE_STEP}
        ariaLabel={"Cell size"}
        onInput={controls.cellSize[1]}
    />
</PageProp>

<PageProp
    itemKey={"colors"}
    label={"Colors"}
    hint={"The colors the pattern is drawn from. Each sample uses as many of them as it needs."}
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
    hint={"How far the pattern is blurred outward, which is what gives it its glow."}
>
    <PageNumberField
        value={controls.blurWidth[0]()}
        min={SVGPatternKnobs.MIN_BLUR_WIDTH}
        max={SVGPatternKnobs.MAX_BLUR_WIDTH}
        step={SVGPatternKnobs.BLUR_WIDTH_STEP}
        ariaLabel={"Blur width"}
        onInput={controls.blurWidth[1]}
    />
</PageProp>

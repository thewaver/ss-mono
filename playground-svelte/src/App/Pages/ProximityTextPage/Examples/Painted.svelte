<script lang="ts">
    import { PaintedText, ProximityText, SVGDefsSamples } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ProximityTextPage/ProximityTextPage.css";

    import type { ProximityTextExampleProps } from "../ProximityTextPageSvelte.types";

    const GRADIENT_DURATION_MS = 4000;
    const NO_BLUR = 0;

    type Props = ProximityTextExampleProps;

    let props: Props = $props();

    const id = $props.id();
</script>

<div class={styles.variableText}>
    <ProximityText reachPx={props.reachPx} isDisabled={props.isDisabled}>
        <PaintedText
            computeFillDefs={(size, element) =>
                SVGDefsSamples.Gradient.Timed.toConfig({ family: "flow_diag_3" }).computeSVGDefs(
                    `fill-${id}`,
                    undefined,
                    element,
                    {
                        getSize: () => size,
                        animationDurationMs: GRADIENT_DURATION_MS,
                        colors: SVGDefsSamples.SAMPLE_COLORS,
                        blurWidth: NO_BLUR,
                    },
                )}>Painted letters push their neighbors along</PaintedText
        >
    </ProximityText>
</div>

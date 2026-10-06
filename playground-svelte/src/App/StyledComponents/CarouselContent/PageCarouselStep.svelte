<script lang="ts">
    import type { CarouselStep } from "@thewaver/ss-components-svelte";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../ControlButtonContent/ControlButtonContent.svelte";
    import type { CarouselStepProps } from "./CarouselContent.types";

    const STEP_GLYPHS: Record<CarouselStep, string> = {
        previous: CONTROL_GLYPHS.previous,
        next: CONTROL_GLYPHS.next,
    };

    let props: CarouselStepProps = $props();
</script>

<PageControlButtonContent flags={props.renderProps} glyph={STEP_GLYPHS[props.renderProps.step]} />

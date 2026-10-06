<script lang="ts">
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../ControlButtonContent/ControlButtonContent.svelte";
    import type { CarouselRotationProps } from "./CarouselContent.types";

    let props: CarouselRotationProps = $props();
</script>

<PageControlButtonContent
    flags={props.flags}
    glyph={props.flags.isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play}
/>

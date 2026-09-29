<script lang="ts" generics="T">
    import Carousel from "../../../Primitives/Carousel/Carousel.svelte";
    import type { DrumCarouselProps } from "../../../Primitives/Carousel/Carousel.types.js";

    let { index = $bindable(0), playback = $bindable(true), ...props }: DrumCarouselProps<T> = $props();
</script>

<Carousel {...props} bind:index bind:playback variant="drum" />

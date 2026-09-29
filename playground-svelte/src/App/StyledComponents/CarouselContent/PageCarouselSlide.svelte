<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CarouselContent/CarouselContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CarouselSlideProps } from "./CarouselContent.types";

    let props: CarouselSlideProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.carouselSlide, layerClass]}>
    <div class={styles.carouselSlideTitle}>{@render props.children?.()}</div>
    <div class={styles.carouselSlideBody}>{`slide ${props.state.index + 1} of ${props.state.count}`}</div>
</div>

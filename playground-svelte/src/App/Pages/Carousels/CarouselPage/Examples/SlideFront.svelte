<script lang="ts">
    import type { CarouselSlideState } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";

    type Props = {
        title: string;
        state: CarouselSlideState;
        isNarrow: boolean;
    };

    let props: Props = $props();
</script>

<div class={[styles.slideFrame, props.isNarrow && styles.slideFrameNarrow]}>
    <PageCarouselSlide state={props.state}>{props.title}</PageCarouselSlide>
</div>

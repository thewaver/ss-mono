<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.css";

    import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.svelte";

    type Props = {
        isNarrow: boolean;
    };

    let props: Props = $props();
</script>

<div class={[styles.slideFrame, props.isNarrow && styles.slideFrameNarrow]}>
    <PageCarouselSlideBack />
</div>

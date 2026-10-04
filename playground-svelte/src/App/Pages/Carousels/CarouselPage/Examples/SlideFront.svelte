<script lang="ts">
    import type { CarouselSlideState } from "@thewaver/ss-components-svelte";

    import PageCarouselSlide from "../../../../StyledComponents/CarouselContent/PageCarouselSlide.svelte";

    type Props = {
        title: string;
        state: CarouselSlideState;
        frameClass: string;
    };

    let props: Props = $props();
</script>

<div class={props.frameClass}>
    <PageCarouselSlide state={props.state}>{props.title}</PageCarouselSlide>
</div>

<script lang="ts">
    import PageCarouselSlideBack from "../../../../StyledComponents/CarouselContent/PageCarouselSlideBack.svelte";

    type Props = {
        frameClass: string;
    };

    let props: Props = $props();
</script>

<div class={props.frameClass}>
    <PageCarouselSlideBack />
</div>

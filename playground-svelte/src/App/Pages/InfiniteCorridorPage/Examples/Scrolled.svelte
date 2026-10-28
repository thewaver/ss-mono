<script lang="ts">
    import { ElementObserverSvelteUtils, InfiniteCorridor } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

    import { createSpinDegrees } from "../InfiniteCorridorPage.utils.svelte";
    import type { InfiniteCorridorScrolledExampleProps } from "../InfiniteCorridorPageSvelte.types";
    import Room from "./Room.svelte";

    type Props = InfiniteCorridorScrolledExampleProps;

    let props: Props = $props();

    let boxRef = $state<HTMLDivElement>();
    let runwayRef = $state<HTMLDivElement>();

    const getProgress = ElementObserverSvelteUtils.createScrollContainerProgressObserver(
        () => runwayRef,
        () => boxRef,
    );

    const scrollTo = (progress: number) => {
        if (boxRef) boxRef.scrollTop = progress * (boxRef.scrollHeight - boxRef.clientHeight);
    };

    const getSpinDegrees = createSpinDegrees(
        () => props.spinDegreesPerSecond,
        () => true,
    );

    const layout = $derived(props.toLayout(getSpinDegrees()));
</script>

<div bind:this={boxRef} class={styles.scrollBox}>
    <div class={styles.scrollPinned}>
        <InfiniteCorridor
            items={props.items}
            {layout}
            bind:progress={getProgress, scrollTo}
            glideDurationMs={props.glideDurationMs}
            ariaLabel={"Scrolled corridor"}
        >
            {#snippet renderItem(name, state)}
                <Room {name} {state} />
            {/snippet}
        </InfiniteCorridor>
    </div>

    <div
        bind:this={runwayRef}
        class={styles.scrollRunway}
        style:height={`${props.scrollLength * styles.CORRIDOR_HEIGHT}px`}
    ></div>
</div>

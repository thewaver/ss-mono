<script lang="ts">
    import { ElementObserverSvelteUtils, InfiniteCorridor } from "@thewaver/ss-components-svelte";
    import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

    import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import { createSpinDegrees } from "../InfiniteCorridorPage.utils.svelte";
    import type { InfiniteCorridorExampleProps } from "../InfiniteCorridorPageSvelte.types";
    import Room from "./Room.svelte";

    type Props = InfiniteCorridorExampleProps;

    let props: Props = $props();

    let boxRef = $state<HTMLDivElement>();
    let runwayRef = $state<HTMLDivElement>();
    let scrollLength = $state(InfiniteCorridorKnobs.STARTING_SCROLL_LENGTH);

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
        style:height={`${scrollLength * styles.CORRIDOR_HEIGHT}px`}
    ></div>
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"scrollLength"}
        controls={"Sets how long the example scroll runway that drives InfiniteCorridorProps.progress is"}
        label={"Scroll length"}
        hint={"How far the box scrolls to walk one lap of the corridor, in heights of the box. Longer is slower."}
    >
        <PageNumberField
            value={scrollLength}
            min={InfiniteCorridorKnobs.MIN_SCROLL_LENGTH}
            max={InfiniteCorridorKnobs.MAX_SCROLL_LENGTH}
            step={InfiniteCorridorKnobs.SCROLL_LENGTH_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Scroll length in box heights"}
            onInput={(value) => {
                scrollLength = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>

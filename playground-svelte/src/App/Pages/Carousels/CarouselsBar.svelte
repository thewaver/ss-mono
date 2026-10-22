<script lang="ts">
    import { Button, ButtonStyles, InteractionTrackerSvelteUtils, InteractionWrapper } from "@thewaver/ss-components-svelte";
    import type { CarouselControls, CarouselStep } from "@thewaver/ss-components-svelte";
    import {
        computeCarouselRotationLabel,
        computeCarouselStepLabel,
        computePositionLabel,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageCarouselBar from "../../StyledComponents/CarouselContent/PageCarouselBar.svelte";
    import PageCarouselPick from "../../StyledComponents/CarouselContent/PageCarouselPick.svelte";
    import PageCarouselRotation from "../../StyledComponents/CarouselContent/PageCarouselRotation.svelte";
    import PageCarouselStep from "../../StyledComponents/CarouselContent/PageCarouselStep.svelte";

    type Props = {
        controls: CarouselControls;
        isDisabled: boolean;
        hasPicks?: boolean;
        hasRotation?: boolean;
    };

    let props: Props = $props();

    const isPlaying = $derived(props.controls.getIsPlaying());
    const picks = $derived(Array.from({ length: props.controls.getCount() }, (_, index) => index));

    let bar = $state<HTMLDivElement>();

    const getIsHeld = InteractionTrackerSvelteUtils.trackHold(() => bar);

    $effect(() => {
        props.controls.setIsHeldByPage(getIsHeld());
    });
</script>

{#snippet stepButton(step: CarouselStep)}
    <Button
        ariaLabel={computeCarouselStepLabel(step)}
        isDisabled={!props.controls.getCanStep(step)}
        onClick={() => {
            props.controls.step(step);
        }}
    >
        {#snippet renderContent(flags)}
            <PageCarouselStep {flags} {step} />
        {/snippet}
    </Button>
{/snippet}

<PageCarouselBar bind:ref={bar}>
    {#if props.hasRotation}
        <Button
            ariaLabel={computeCarouselRotationLabel(isPlaying)}
            isDisabled={props.isDisabled}
            onClick={() => {
                props.controls.setIsPlaying(!props.controls.getIsPlaying());
            }}
        >
            {#snippet renderContent(flags)}
                <PageCarouselRotation {flags} {isPlaying} />
            {/snippet}
        </Button>
    {/if}

    {@render stepButton("previous")}

    {#if props.hasPicks}
        {#each picks as index (index)}
            {@const isCurrent = index === props.controls.getIndex()}
            <InteractionWrapper isDisabled={props.isDisabled}>
                {#snippet renderControl(attachElement, flags)}
                    <button
                        {@attach attachElement}
                        type="button"
                        class={ButtonStyles.buttonElement}
                        aria-label={computePositionLabel(index, props.controls.getCount())}
                        aria-current={isCurrent || undefined}
                        aria-disabled={flags.isDisabled || undefined}
                        onclick={() => {
                            if (flags.isDisabled) return;

                            props.controls.pick(index);
                        }}
                    >
                        <PageCarouselPick {flags} {isCurrent} />
                    </button>
                {/snippet}
            </InteractionWrapper>
        {/each}
    {/if}

    {@render stepButton("next")}
</PageCarouselBar>

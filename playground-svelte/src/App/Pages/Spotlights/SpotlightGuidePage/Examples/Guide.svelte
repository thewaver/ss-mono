<script lang="ts">
    import { Button, SpotlightGuide } from "@thewaver/ss-components-svelte";
    import { PADDING, TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { getLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
    import PageSpotlightPopup from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopup.svelte";
    import PageSpotlightPopupActions from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupActions.svelte";
    import PageSpotlightPopupText from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupText.svelte";
    import { renderHighlight, renderOverlay } from "../../Spotlights.const.svelte";
    import type { SpotlightGuideExampleProps } from "../../Spotlights.types";

    type Props = SpotlightGuideExampleProps;

    let { visibility = $bindable(), ...props }: Props = $props();

    const layerClass = $derived.by(getLayerClass());

    let stepRefs = $state<(HTMLElement | undefined)[]>(TOUR_STEPS.map(() => undefined));

    const isLastStep = $derived(props.step >= TOUR_STEPS.length - 1);
</script>

<div class={[styles.root, layerClass]}>
    <div class={styles.tourStrip} data-scroll-box="">
        {#each TOUR_STEPS as step, index (step.title)}
            <div bind:this={stepRefs[index]} class={styles.tourTarget}>
                {step.title}
            </div>
        {/each}
    </div>

    <Button
        onClick={async () => {
            props.onStart();
            visibility = true;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Take the tour</PageButtonContent>
        {/snippet}
    </Button>

    <SpotlightGuide
        elementRef={stepRefs[props.step] ?? undefined}
        padding={PADDING}
        ariaLabel={"Product tour"}
        announcement={`Step ${props.step + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[props.step].title}.`}
        bind:visibility
        {renderHighlight}
        {renderOverlay}
    >
        {#snippet renderPopup(visibilityTarget, transitionDurationMs)}
            <PageSpotlightPopup {visibilityTarget} {transitionDurationMs} title={TOUR_STEPS[props.step].title}>
                <PageSpotlightPopupText>{TOUR_STEPS[props.step].text}</PageSpotlightPopupText>

                <PageSpotlightPopupActions>
                    <Button onClick={async () => props.onEnd("skipped")}>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Skip all</PageButtonContent>
                        {/snippet}
                    </Button>

                    <Button
                        onClick={async () => {
                            if (!isLastStep) {
                                props.onStepChange(props.step + 1);

                                return;
                            }

                            props.onEnd("finished");
                        }}
                    >
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>{isLastStep ? "Done" : "Next"}</PageButtonContent>
                        {/snippet}
                    </Button>
                </PageSpotlightPopupActions>
            </PageSpotlightPopup>
        {/snippet}
    </SpotlightGuide>
</div>

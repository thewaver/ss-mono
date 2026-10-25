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

    const layerClass = $derived.by(getLayerClass());

    let visibility = $state(false);
    let step = $state(0);

    let stepRefs = $state<(HTMLElement | undefined)[]>(TOUR_STEPS.map(() => undefined));

    const isLastStep = $derived(step >= TOUR_STEPS.length - 1);
</script>

<div dir={"rtl"} class={[styles.root, layerClass]}>
    <div class={styles.tourStrip} data-scroll-box="">
        {#each TOUR_STEPS as tourStep, index (tourStep.title)}
            <div bind:this={stepRefs[index]} class={styles.tourTarget}>
                {tourStep.title}
            </div>
        {/each}
    </div>

    <Button
        id={"rightToLeftGuideStart"}
        onClick={() => {
            step = 0;
            visibility = true;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Take the tour</PageButtonContent>
        {/snippet}
    </Button>

    <SpotlightGuide
        elementRef={stepRefs[step] ?? undefined}
        padding={PADDING}
        ariaLabel={"Product tour"}
        announcement={`Step ${step + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[step].title}.`}
        bind:visibility
        {renderHighlight}
        {renderOverlay}
    >
        {#snippet renderPopup(visibilityTarget, transitionDurationMs)}
            <PageSpotlightPopup {visibilityTarget} {transitionDurationMs} title={TOUR_STEPS[step].title}>
                <PageSpotlightPopupText>{TOUR_STEPS[step].text}</PageSpotlightPopupText>

                <PageSpotlightPopupActions>
                    <Button
                        id={"rightToLeftGuideSkip"}
                        onClick={() => {
                            visibility = false;
                        }}
                    >
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Skip all</PageButtonContent>
                        {/snippet}
                    </Button>

                    <Button
                        id={"rightToLeftGuideNext"}
                        onClick={() => {
                            if (isLastStep) {
                                visibility = false;

                                return;
                            }

                            step += 1;
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

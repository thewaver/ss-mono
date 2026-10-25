<script lang="ts">
    import { Button, SpotlightGuide } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { TOUR_STEPS } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { getLayerClass } from "../../../../StyledComponents/Layer/Layer.context";
    import PageSpotlightPopup from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopup.svelte";
    import PageSpotlightPopupActions from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupActions.svelte";
    import PageSpotlightPopupText from "../../../../StyledComponents/SpotlightPopup/PageSpotlightPopupText.svelte";
    import { renderHighlight, renderOverlay } from "../../Spotlights.const.svelte";
    import type { SpotlightGuideBasicDocsExampleProps } from "../../SpotlightsSvelte.types";

    type Props = SpotlightGuideBasicDocsExampleProps;

    let props: Props = $props();

    const layerClass = $derived.by(getLayerClass());

    let visibility = $state(false);
    let step = $state(0);
    let status = $state("not started");

    let stepRefs = $state<(HTMLElement | undefined)[]>(TOUR_STEPS.map(() => undefined));

    const isLastStep = $derived(step >= TOUR_STEPS.length - 1);

    const end = (next: string) => {
        status = next;
        visibility = false;
    };
</script>

<div class={[styles.root, layerClass]}>
    <div class={styles.tourStrip} data-scroll-box="">
        {#each TOUR_STEPS as tourStep, index (tourStep.title)}
            <div bind:this={stepRefs[index]} class={styles.tourTarget}>
                {tourStep.title}
            </div>
        {/each}
    </div>

    <Button
        id={"guideStart"}
        onClick={() => {
            step = 0;
            status = "running";
            visibility = true;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Take the tour</PageButtonContent>
        {/snippet}
    </Button>

    <SpotlightGuide
        elementRef={stepRefs[step] ?? undefined}
        padding={props.padding}
        transitionDurationMs={props.transitionDurationMs}
        popupPlacement={props.popupPlacement}
        popupOffset={props.popupOffset}
        ariaLabel={"Product tour"}
        announcement={`Step ${step + 1} of ${TOUR_STEPS.length}. ${TOUR_STEPS[step].title}.`}
        bind:visibility
        {renderHighlight}
        {renderOverlay}
        onHide={() => {
            if (status === "running") status = "closed with Escape";
        }}
    >
        {#snippet renderPopup(visibilityTarget, transitionDurationMs)}
            <PageSpotlightPopup {visibilityTarget} {transitionDurationMs} title={TOUR_STEPS[step].title}>
                <PageSpotlightPopupText>{TOUR_STEPS[step].text}</PageSpotlightPopupText>

                <PageSpotlightPopupActions>
                    <Button id={"guideSkip"} onClick={() => end("skipped")}>
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Skip all</PageButtonContent>
                        {/snippet}
                    </Button>

                    <Button
                        id={"guideNext"}
                        onClick={() => {
                            if (isLastStep) {
                                end("finished");

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

    <div class={exampleStyles.exampleReadout} data-readout>
        {`Tour: ${status}`}
    </div>
</div>

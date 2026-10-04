<script lang="ts">
    import type { Snippet } from "svelte";

    import type { AnchorPlacement, SelectOption, Toast } from "@thewaver/ss-components-svelte";
    import { Button, Range, Select, Toasts, ViewportWrapper } from "@thewaver/ss-components-svelte";
    import { ViewportWrapperKnobs } from "@thewaver/ss-playground/App/Knobs/ViewportWrappers.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ViewportWrapperPage/ViewportWrapperPage.css";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageVariants from "../../PageComponents/Variants/Variants.svelte";
    import type { VariantDefs } from "../../PageComponents/Variants/Variants.types";
    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.svelte";
    import PageSelectContent from "../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import PageToastContent from "../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../StyledComponents/ToastContent/ToastContent.types";
    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import ViewportReadout from "./ViewportReadout.svelte";

    const COUNTRIES: SelectOption<string>[] = [
        { value: "Belgium" },
        { value: "Denmark" },
        { value: "Estonia" },
        { value: "Finland" },
        { value: "Germany" },
        { value: "Iceland" },
        { value: "Ireland" },
        { value: "Latvia" },
        { value: "Norway" },
        { value: "Poland" },
        { value: "Portugal" },
        { value: "Sweden" },
    ];

    const PERCENT = 100;

    const SCROLL_SIZE = { width: styles.HOST_SIZE, height: styles.HOST_SIZE };
    const INNER_TOAST_GAP = 10;
    const INNER_TOAST_MARGIN = 10;
    const INNER_TOAST_MESSAGE = "Raised inside the square.";

    const TOOLTIP_DEFS = {
        placement: { x: "center", y: "top-out" } as const,
        offset: { x: 0, y: 10 },
        renderContent: roamingTooltip,
    };

    let roamerX = $state(ViewportWrapperKnobs.STARTING_ROAMER_X);
    let roamerY = $state(ViewportWrapperKnobs.STARTING_ROAMER_Y);
    let scalePercent = $state(PERCENT);
    let roamingValue = $state<string | undefined>();
    let innerToasts = $state.raw<Toast<ToastDefs>[]>([]);
    let scrolledValue = $state<string | undefined>();

    const stageSize = $derived.by(() => {
        const side = Math.round((styles.HOST_SIZE * PERCENT) / scalePercent);

        return { width: side, height: side };
    });

    let toastCount = 0;

    const items: VariantDefs[] = [
        {
            key: "roaming",
            name: "A control roaming the viewport",
            component: roamingVariant,
        },
        {
            key: "scrolled",
            name: "An anchor inside a scrolled box",
            component: scrolledVariant,
        },
    ];
</script>

{#snippet roamingTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        My tooltip has the same boundary I do.
    </PageTooltipContent>
{/snippet}

{#snippet renderCountryPopup(
    renderOptions: Snippet,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
)}
    <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
        {@render renderOptions()}
    </PagePopoverSurface>
{/snippet}

{#snippet roamingVariant()}
    <div class={styles.sectionBody}>
        <div>
            The dashed square is a viewport of its own, so it is the boundary that counts. Park the control against any
            edge of it: its tooltip and its list turn around rather than cross that edge, keep the side of the control
            they are on, and are cut by the square when there is not enough room. The scale slider changes the
            resolution the square is designed for, so everything inside it grows or shrinks while the boundary stays
            where it is.
        </div>

        <div class={styles.controls}>
            <div>Across</div>
            <Range
                bind:value={roamerX}
                id={"roamerX"}
                ariaLabel={"Horizontal position"}
                thumbSize={RANGE_THUMB_SIZE}
            >
                {#snippet renderContent(renderProps)}
                    <PageRangeContent {renderProps} />
                {/snippet}
            </Range>

            <div>Down</div>
            <Range
                bind:value={roamerY}
                id={"roamerY"}
                ariaLabel={"Vertical position"}
                thumbSize={RANGE_THUMB_SIZE}
            >
                {#snippet renderContent(renderProps)}
                    <PageRangeContent {renderProps} />
                {/snippet}
            </Range>

            <div>Scale</div>
            <Range
                bind:value={scalePercent}
                id={"viewportScale"}
                ariaLabel={"Viewport scale"}
                min={ViewportWrapperKnobs.SCALE_MIN}
                max={ViewportWrapperKnobs.SCALE_MAX}
                step={ViewportWrapperKnobs.SCALE_STEP}
                thumbSize={RANGE_THUMB_SIZE}
            >
                {#snippet renderContent(renderProps)}
                    <PageRangeContent {renderProps} />
                {/snippet}
            </Range>
        </div>

        <div class={styles.readout} data-readout="">
            {`x: ${roamerX}% | y: ${roamerY}% | scale: ${scalePercent}% of ${styles.HOST_SIZE}px`}
        </div>

        <div class={styles.host} data-stage="">
            <ViewportWrapper size={stageSize}>
                <div
                    class={styles.roamer}
                    style:left={`${roamerX}%`}
                    style:top={`${roamerY}%`}
                    style:transform={`translate(-${roamerX}%, -${roamerY}%)`}
                >
                    <Select
                        renderHighlightFloater={renderPageHighlightFloater}
                        bind:value={roamingValue}
                        options={COUNTRIES}
                        id={"roamingCountry"}
                        ariaLabel={"Roaming country"}
                        tooltipDefs={TOOLTIP_DEFS}
                        renderPopup={renderCountryPopup}
                    >
                        {#snippet renderContent(selectedOption, flags)}
                            <PageSelectContent {flags}>{selectedOption?.value ?? "Pick one"}</PageSelectContent>
                        {/snippet}

                        {#snippet renderOption(option, flags)}
                            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
                        {/snippet}
                    </Select>
                </div>

                <div class={styles.toastRaiser}>
                    <Button
                        id={"raiseInnerToast"}
                        ariaLabel={"Raise a notification inside the viewport"}
                        onClick={() => {
                            toastCount += 1;

                            const id = `innerToast${toastCount}`;

                            innerToasts = [
                                ...innerToasts,
                                { id, value: { kind: "info", message: INNER_TOAST_MESSAGE } },
                            ];
                        }}
                    >
                        {#snippet renderContent(flags)}
                            <PageButtonContent {flags}>Notify</PageButtonContent>
                        {/snippet}
                    </Button>
                </div>

                <Toasts
                    bind:toasts={innerToasts}
                    ariaLabel={"Viewport notifications"}
                    alignment={"bottom-center"}
                    margins={{
                        marginTop: INNER_TOAST_MARGIN,
                        marginRight: INNER_TOAST_MARGIN,
                        marginBottom: INNER_TOAST_MARGIN,
                        marginLeft: INNER_TOAST_MARGIN,
                    }}
                >
                    {#snippet renderToast(toast, visibilityTarget, transitionDurationMs, state)}
                        <PageToastContent
                            {toast}
                            {state}
                            animation={"fade"}
                            stacking={"flow"}
                            dir={"column"}
                            gap={INNER_TOAST_GAP}
                            {visibilityTarget}
                            {transitionDurationMs}
                            onDismiss={() => {
                                innerToasts = innerToasts.filter((candidate) => candidate.id !== toast.id);
                            }}
                        />
                    {/snippet}
                </Toasts>

                <ViewportReadout />
            </ViewportWrapper>
        </div>
    </div>
{/snippet}

{#snippet scrolledVariant()}
    <div class={styles.sectionBody}>
        <div>
            A viewport of the same size with a scrolling area inside it. Scrolling moves the anchor without moving the
            page, so an open list has to follow it, stay off it, and stop at the square.
        </div>

        <div class={styles.host}>
            <ViewportWrapper size={SCROLL_SIZE}>
                <div class={styles.scrollBox} data-scroll-box="">
                    <div class={styles.scrollFiller}></div>

                    <Select
                        renderHighlightFloater={renderPageHighlightFloater}
                        bind:value={scrolledValue}
                        options={COUNTRIES}
                        id={"scrolledCountry"}
                        ariaLabel={"Scrolled country"}
                        renderPopup={renderCountryPopup}
                    >
                        {#snippet renderContent(selectedOption, flags)}
                            <PageSelectContent {flags}>{selectedOption?.value ?? "Pick one"}</PageSelectContent>
                        {/snippet}

                        {#snippet renderOption(option, flags)}
                            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
                        {/snippet}
                    </Select>

                    <div class={styles.scrollFiller}></div>
                </div>
            </ViewportWrapper>
        </div>
    </div>
{/snippet}

<PageVariants minColumnWidth={styles.MIN_COLUMN_WIDTH} {items} />

<script lang="ts">
    import type { ArcDefs } from "@thewaver/ss-components-svelte";
    import { PlacementLayoutUtils, Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageRadioStarCell from "../../../StyledComponents/RadioStarContent/PageRadioStarCell.svelte";
    import PageRadioStarContent from "../../../StyledComponents/RadioStarContent/PageRadioStarContent.svelte";
    import type { RadioRatingExampleProps } from "../RadioPage.types";

    const RATING_OPTIONS = [1, 2, 3, 4, 5];

    const ARC_DEFS: ArcDefs = {
        curveHeightRatio: 0.3867,
        spreadDegrees: 160,
        itemWidthRatio: 0.11,
        itemHeightRatio: 1.0909,
    };

    const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

    type Props = RadioRatingExampleProps;

    const ARC_WIDTH = "300px";

    let { value = $bindable(), hovered = $bindable() }: Props = $props();
</script>

<div style:width={ARC_WIDTH}>
    <RadioGroup bind:value ariaLabel={"Rating on an arc"} computeLayout={ARC_LAYOUT}>
        {#each RATING_OPTIONS as rating (rating)}
            <Radio
                value={rating}
                ariaLabel={rating === 1 ? "1 star" : `${rating} stars`}
                onMouseEnter={() => {
                    hovered = rating;
                }}
                onMouseLeave={() => {
                    hovered = undefined;
                }}
            >
                {#snippet renderContent(flags)}
                    <PageRadioStarCell>
                        <PageRadioStarContent {flags} isFilled={rating <= (hovered ?? value)} />
                    </PageRadioStarCell>
                {/snippet}
            </Radio>
        {/each}
    </RadioGroup>
</div>

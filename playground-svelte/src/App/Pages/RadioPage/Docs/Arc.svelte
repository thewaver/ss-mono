<script lang="ts">
    
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";
    import { ARC_LAYOUT, ARC_WIDTH, STARTING_RATING } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

    import PageRadioStarCell from "../../../StyledComponents/RadioStarContent/PageRadioStarCell.svelte";
    import PageRadioStarContent from "../../../StyledComponents/RadioStarContent/PageRadioStarContent.svelte";

    const RATING_OPTIONS = [1, 2, 3, 4, 5];

    let value = $state(STARTING_RATING);
    let hovered = $state<number>();
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

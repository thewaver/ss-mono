<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";
    import { STARTING_RATING } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

    import PageRadioStarContent from "../../../StyledComponents/RadioStarContent/PageRadioStarContent.svelte";

    const RATING_OPTIONS = [1, 2, 3, 4, 5];

    let value = $state(STARTING_RATING);
    let hovered = $state<number>();
</script>

<RadioGroup bind:value ariaLabel={"Rating"} orientation={"horizontal"} gap={0}>
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
                <PageRadioStarContent {flags} isFilled={rating <= (hovered ?? value)} />
            {/snippet}
        </Radio>
    {/each}
</RadioGroup>

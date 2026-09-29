<script lang="ts">
    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";

    import PageRadioStarContent from "../../../StyledComponents/RadioStarContent/PageRadioStarContent.svelte";
    import type { RadioRatingExampleProps } from "../RadioPage.types";

    const RATING_OPTIONS = [1, 2, 3, 4, 5];

    type Props = RadioRatingExampleProps;

    let { value = $bindable(), hovered = $bindable() }: Props = $props();
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

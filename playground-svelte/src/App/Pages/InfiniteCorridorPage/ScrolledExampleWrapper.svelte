<script lang="ts">
    import { InfiniteCorridorKnobs } from "@thewaver/ss-playground/App/Knobs/InfiniteCorridors.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import ScrolledExample from "./Examples/Scrolled.svelte";
    import type { InfiniteCorridorExampleProps } from "./InfiniteCorridorPageSvelte.types";

    let props: InfiniteCorridorExampleProps = $props();

    let scrollLength = $state(InfiniteCorridorKnobs.STARTING_SCROLL_LENGTH);
</script>

<ScrolledExample {...props} {scrollLength} />

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

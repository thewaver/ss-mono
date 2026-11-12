<script lang="ts">
    import { untrack } from "svelte";

    import { Radio, RadioGroup } from "@thewaver/ss-components-svelte";
    import { RADIO_GROUP_GAP } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

    import PageRadioContent from "../../StyledComponents/RadioContent/RadioContent.svelte";
    import type { SkinStateProps } from "./AppearancePage.types";

    let props: SkinStateProps = $props();

    let value = $state(untrack(() => (props.isChecked ? props.state : undefined)));
</script>

<RadioGroup bind:value ariaLabel={props.state} gap={RADIO_GROUP_GAP} hasError={props.hasError}>
    <Radio value={props.state} ariaLabel={props.state} isDisabled={props.isDisabled} hasError={props.hasError}>
        {#snippet renderContent(flags)}
            <PageRadioContent {flags}>{props.state}</PageRadioContent>
        {/snippet}
    </Radio>
</RadioGroup>

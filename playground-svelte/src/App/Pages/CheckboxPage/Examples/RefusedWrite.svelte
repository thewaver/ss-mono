<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.svelte";
    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import type { CheckboxRefusedWriteExampleProps } from "../CheckboxPage.types";

    type Props = CheckboxRefusedWriteExampleProps;

    let { email = $bindable(), sms = $bindable() }: Props = $props();
</script>

<PageControlRow>
    <Checkbox
        bind:checked={email}
        id={"email"}
        ariaLabel={"Email"}
        onChange={(isChecked) => {
            if (isChecked || sms) return;

            email = true;
        }}
    >
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>

    <PageControlRowLabel>or</PageControlRowLabel>

    <Checkbox
        bind:checked={sms}
        ariaLabel={"SMS"}
        onChange={(isChecked) => {
            if (isChecked || email) return;

            sms = true;
        }}
    >
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>
</PageControlRow>

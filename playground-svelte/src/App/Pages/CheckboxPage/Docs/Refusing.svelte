<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.svelte";
    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";

    let email = $state(true);
    let sms = $state(false);
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
            <PageCheckboxContent {flags}>Email</PageCheckboxContent>
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
            <PageCheckboxContent {flags}>SMS</PageCheckboxContent>
        {/snippet}
    </Checkbox>
</PageControlRow>

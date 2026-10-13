<script lang="ts">
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    ONE_TIME_CODE_LENGTH,
    RECOVERY_CODE_LENGTH,
} from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import OneTimeCodeExample from "./Examples/OneTimeCode.svelte";
    import RecoveryCodeExample from "./Examples/RecoveryCode.svelte";

    let oneTimeCode = $state("");
    let recoveryCode = $state("");

    const examples: ExampleDefs[] = [
        {
            key: "oneTimeCode",
            name: EXAMPLE_NAMES.oneTimeCode,
            readout: () =>
                `value: "${oneTimeCode}" — ${ONE_TIME_CODE_LENGTH} digits in one field; press a cell to put the caret there`,
            component: oneTimeCodeExample,
            path: `${EXAMPLES_ROOT}/OneTimeCode.svelte`,
        },
        {
            key: "recoveryCode",
            name: EXAMPLE_NAMES.recoveryCode,
            readout: () =>
                `value: "${recoveryCode}" — ${RECOVERY_CODE_LENGTH} cells taking letters and digits, anything else refused`,
            component: recoveryCodeExample,
            path: `${EXAMPLES_ROOT}/RecoveryCode.svelte`,
        },
    ];
</script>

{#snippet oneTimeCodeExample()}
    <OneTimeCodeExample bind:value={oneTimeCode} />
{/snippet}

{#snippet recoveryCodeExample()}
    <RecoveryCodeExample bind:value={recoveryCode} />
{/snippet}

<PageExamples items={examples} />

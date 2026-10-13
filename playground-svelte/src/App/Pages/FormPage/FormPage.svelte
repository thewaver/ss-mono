<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import FocusOnErrorExample from "./Examples/FocusOnError.svelte";
    import SignUpExample from "./Examples/SignUp.svelte";
    import { EXAMPLE_NAMES, EXAMPLES_ROOT } from "@thewaver/ss-playground/App/Pages/FormPage/FormPage.const";

    let email = $state("");
    let password = $state("");
    let terms = $state(false);

    let outcome = $state("not submitted");

    let plan = $state<string | undefined>();
    let topics = $state.raw<string[]>([]);

    let focusOutcome = $state("not submitted");

    const examples: ExampleDefs[] = [
        {
            key: "reportsValidity",
            name: EXAMPLE_NAMES.reportsValidity,
            readout: () => `outcome: ${outcome}`,
            component: signUpExample,
            path: `${EXAMPLES_ROOT}/SignUp.svelte`,
        },
        {
            key: "focusOnError",
            name: EXAMPLE_NAMES.focusOnError,
            readout: () =>
                `outcome: ${focusOutcome} — the handler runs either way, and afterwards focus lands on the first field reporting an error`,
            component: focusOnErrorExample,
            path: `${EXAMPLES_ROOT}/FocusOnError.svelte`,
        },
    ];
</script>

{#snippet signUpExample()}
    <SignUpExample
        bind:email
        bind:password
        bind:terms
        onSubmit={() => {
            outcome = `submitted as ${email}`;
        }}
        onReset={() => {
            outcome = "not submitted";
        }}
    />
{/snippet}

{#snippet focusOnErrorExample()}
    <FocusOnErrorExample
        bind:plan
        bind:topics
        onSubmit={() => {
            focusOutcome = `submitted as ${plan ?? "no plan"}, [${topics.join(", ")}]`;
        }}
        onReset={() => {
            plan = undefined;
            topics = [];
            focusOutcome = "not submitted";
        }}
    />
{/snippet}

<PageExamples items={examples} />

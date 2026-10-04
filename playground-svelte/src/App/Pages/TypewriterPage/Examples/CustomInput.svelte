<script lang="ts">
    import { untrack } from "svelte";

    import { Typewriter } from "@thewaver/ss-components-svelte";
    import { FunctionUtils } from "@thewaver/ss-utils";

    import type { TypewriterExampleProps } from "../TypewriterPage.types";

    type Props = TypewriterExampleProps & {
        text: string;
    };

    let props: Props = $props();

    let text = $state(untrack(() => props.text));

    const setTextDebounced = FunctionUtils.debounce((next: string) => {
        text = next;
    }, 500);

    $effect(() => setTextDebounced.cancel);

    $effect(() => {
        setTextDebounced(props.text);
    });
</script>

<Typewriter computeAnimationName={props.computeAnimationName} computeCharacterWeights={props.computeCharacterWeights}>
    {text}
</Typewriter>

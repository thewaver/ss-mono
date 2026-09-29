<script lang="ts">
    import { untrack } from "svelte";

    import { Typewriter, watchChange } from "@thewaver/ss-components-svelte";
    import type { TypewriterController } from "@thewaver/ss-components-svelte";
    import { FunctionUtils } from "@thewaver/ss-utils";

    import type { TypewriterExampleProps } from "../TypewriterPage.types";

    type Props = TypewriterExampleProps & {
        text: string;
    };

    let props: Props = $props();

    let controller: TypewriterController | undefined;

    let text = $state(untrack(() => props.text));

    const setTextDebounced = FunctionUtils.debounce((next: string) => {
        text = next;
    }, 500);

    $effect(() => setTextDebounced.cancel);

    $effect(() => {
        setTextDebounced(props.text);
    });

    watchChange(
        () => text,
        () => controller?.update("content"),
    );
</script>

<Typewriter
    animationName={props.animationName}
    computeCharacterWeights={props.computeCharacterWeights}
    onMount={(next) => {
        controller = next;
    }}
>
    {text}
</Typewriter>

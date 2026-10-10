<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import { setExampleKnobsContext } from "../ExampleKnobs/ExampleKnobs.context";
    import type { FirstExampleProps } from "./Examples.types";

    let props: FirstExampleProps = $props();

    setExampleKnobsContext({ setRenderKnobs: () => undefined });
</script>

<div class={styles.exampleDemo} data-demo="" data-testid={props.example.key}>
    {@render props.example.component()}
</div>

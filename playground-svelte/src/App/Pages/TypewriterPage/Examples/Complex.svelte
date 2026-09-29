<script lang="ts">
    import { Typewriter } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
    import knight from "@thewaver/ss-playground/App/knight.webp";

    import type { TypewriterExampleProps } from "../TypewriterPage.types";

    type Props = TypewriterExampleProps;

    let props: Props = $props();
</script>

<Typewriter animationName={props.animationName} computeCharacterWeights={props.computeCharacterWeights}>
    This is a bit of <b
        >text that appears<div class={styles.textHighlight} style:color={"red"} title="ONE MEANS ONE!"><i>one</i></div
        ></b
    ><span>single</span>{" text character\tat a time,"}<br /><br /><div
        style:width={"100%"}
        style:height={"0.5em"}
        style:border-bottom={"2px solid currentColor"}
    ></div>{"and has\nescaped "}<img src={knight} height={24} style:vertical-align={"middle"} /><a
        href="http://www.google.com">characters.</a
    >
</Typewriter>

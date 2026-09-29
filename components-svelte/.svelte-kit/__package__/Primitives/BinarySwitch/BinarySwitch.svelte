<script lang="ts">
    import { type BinarySwitchFlags, BinarySwitchUtils } from "@thewaver/ss-components";

    import InteractionWrapper from "../InteractionWrapper/InteractionWrapper.svelte";
    import type { BinarySwitchProps } from "./BinarySwitch.types.js";
    import BinarySwitchElement from "./BinarySwitchElement.svelte";

    let { ref = $bindable(), ...props }: BinarySwitchProps = $props();

    const extraFlags: BinarySwitchFlags = $derived({
        checkedState: BinarySwitchUtils.computeCheckedState(props.isChecked, props.isMixed ?? false),
    });
</script>

<InteractionWrapper {...props} bind:ref {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        <BinarySwitchElement
            {attachElement}
            id={props.id}
            type={props.type}
            isSwitch={props.isSwitch}
            name={props.name}
            ariaLabel={props.ariaLabel}
            isRequired={props.isRequired}
            {flags}
            isChecked={props.isChecked}
            isMixed={props.isMixed}
            renderContent={props.renderContent}
            onChange={props.onChange}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>

import { Index, Show } from "solid-js";

import { access } from "../../Utils/propUtils";
import type { FormValueProps } from "./FormValueSolid.types";

export const FormValue = (props: FormValueProps) => (
    <Show when={access(props.name)}>
        <Index each={access(props.values)}>
            {(getValue) => <input type="hidden" name={access(props.name)} value={getValue()} />}
        </Index>
    </Show>
);

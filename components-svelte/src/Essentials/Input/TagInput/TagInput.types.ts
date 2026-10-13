import type { Snippet } from "svelte";

import type { BaseTagInputValues, InteractionFlags, TagInputCbs, TagInputFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types.js";

export type { TagInputCbs };

export type TagInputProps = Omit<InteractionWrapperProps<TagInputFlags>, "renderControl" | "extraFlags" | "role"> &
    TagInputCbs &
    Pick<InteractionControlProps<TagInputFlags>, "id" | "renderContent"> &
    BaseTagInputValues & {
        /** The tags. Bind it with `bind:value`; it is the only thing that adds or removes one. */
        value: string[];
        /**
         * What is currently typed but not yet turned into a tag. Bind it with `bind:text` to read or change it; leave
         * it out and the field holds its own, starting empty.
         */
        text?: string;
        /** Styles the field's text against its current state. */
        computeTextStyle?: (flags: InteractionFlags<TagInputFlags>) => TextFieldTextStyle;
        /** Draws one tag. */
        renderTag: Snippet<[tag: string, flags: InteractionFlags]>;
        /** Draws the placeholder shown while the field is empty. */
        renderPlaceholder?: Snippet<[flags: InteractionFlags<TagInputFlags>]>;
    };

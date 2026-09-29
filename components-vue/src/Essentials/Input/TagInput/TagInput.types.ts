import type { VNodeChild } from "vue";

import type { InteractionFlags, TagInputCbs, TagInputFlags, TagInputState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextField.types";

export type { TagInputCbs };

export type TagInputProps = Omit<InteractionWrapperProps<TagInputFlags>, "extraFlags" | "role"> &
    TagInputCbs &
    Pick<InteractionControlProps<TagInputFlags>, "id"> &
    TagInputState & {
        /** The tags. It is the only thing that adds or removes one. */
        "value": string[];
        /** Receives the tags whenever one is added or removed, which is what `v-model:value` binds. */
        "onUpdate:value"?: (tags: string[]) => void;
        /** What is currently typed but not yet turned into a tag. */
        "text"?: string;
        /** Receives the text as it is typed, which is what `v-model:text` binds. */
        "onUpdate:text"?: (text: string) => void;
        /** Styles the field's text against its current state. */
        "computeTextStyle"?: (flags: InteractionFlags<TagInputFlags>) => TextFieldTextStyle;
    };

export type TagInputSlots = Pick<InteractionWrapperSlots<TagInputFlags>, "renderDecoration"> &
    InteractionControlSlots<TagInputFlags> & {
        /** Draws one tag. */
        renderTag: (props: { tag: string; flags: InteractionFlags }) => VNodeChild;
        /** Draws the placeholder shown while the field is empty. */
        renderPlaceholder?: (flags: InteractionFlags<TagInputFlags>) => VNodeChild;
    };

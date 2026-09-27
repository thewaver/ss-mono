import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags, TagInputCbs, TagInputFlags, TagInputState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { TextFieldTextStyle } from "../../../Primitives/TextField/TextFieldSolid.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type TagInputProps = Omit<InteractionWrapperProps<TagInputFlags>, "renderControl" | "extraFlags" | "role"> &
    AccessorProps<
        TagInputCbs &
            Pick<InteractionControlProps<TagInputFlags>, "id" | "renderContent"> &
            TagInputState & {
                /** The tags. It is the only thing that adds or removes one. */
                valueSignal: SignalSource<string[]>;
                /** What is currently typed but not yet turned into a tag. */
                textSignal?: SignalSource<string>;
                /** Styles the field's text against its current state. */
                computeTextStyle?: (getFlags: () => InteractionFlags<TagInputFlags>) => TextFieldTextStyle;
                /** Draws one tag. */
                renderTag: (getTag: Accessor<string>, getFlags: () => InteractionFlags) => JSX.Element;
                /** Draws the placeholder shown while the field is empty. */
                renderPlaceholder?: (getFlags: () => InteractionFlags<TagInputFlags>) => JSX.Element;
            }
    >;

import type { Shortcut } from "../../../Abstracts/Shortcut/Shortcut.types";
import type { CommandPaletteActionRecord, CommandPaletteItemRecord } from "./CommandPalette.types";

/** What a command palette needs beyond the list it shares with `Select`. */
export namespace CommandPaletteUtils {
    /**
     * The actions whose own shortcut should be listened for, with the groups dissolved.
     *
     * An action with no shortcut is left out, and so is a disabled one, since its shortcut must do nothing.
     *
     * @param items The actions and groups, as the palette was handed them.
     * @returns The actions to register, in the order they are shown.
     */
    export const getBoundActions = <T, D>(items: CommandPaletteItemRecord<T, D>[]) =>
        items
            .flatMap((item) => ("options" in item ? item.options : [item]))
            .filter(
                (action): action is CommandPaletteActionRecord<T, D> & { shortcut: Shortcut } =>
                    action.shortcut !== undefined && !action.isDisabled,
            );
}

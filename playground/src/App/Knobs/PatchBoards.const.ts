export namespace PatchBoardKnobs {
    export const MIN_SOCKET_SIZE = 0.02;
    export const MAX_SOCKET_SIZE = 0.06;
    export const SOCKET_SIZE_STEP = 0.005;

    export const STARTING_IS_LOCKED = false;
    export const STARTING_IS_DISABLED = false;

    export const SOCKET_SIZE_TEXT = {
        label: "Socket size",
        hint: "How large each socket is drawn, as a fraction of the board's width, so a wider board has larger sockets.",
        controls: "Sets PatchBoardProps.socketSize",
    };

    export const IS_LOCKED_TEXT = {
        label: "Wiring locked",
        hint: "Freezes the wiring as it stands: the cables still show, but none can be dragged, made or pulled out.",
        controls: "Sets PatchBoardProps.isLocked",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the whole board off, so nothing on it responds to the pointer or the keyboard.",
        controls: "Sets PatchBoardProps.isDisabled",
    };

    export const IS_BEAM_PLAYING_TEXT = {
        label: "Beams moving",
        hint: "Whether a pulse runs along every plugged cable, from the output to the input it feeds. It starts stopped while the visitor has asked for reduced motion.",
        controls: "Plays the example beam drawn by PatchBoardProps.renderCable",
    };
}

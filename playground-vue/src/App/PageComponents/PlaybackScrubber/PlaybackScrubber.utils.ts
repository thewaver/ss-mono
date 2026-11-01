import { type WritableComputedRef, computed, shallowRef } from "vue";

export namespace PlaybackScrubberUtils {
    export const useGroup = (firstKey: string) => {
        const playingKey = shallowRef<string | undefined>(firstKey);

        return (key: string): WritableComputedRef<boolean> =>
            computed({
                get: () => playingKey.value === key,
                set: (isPlaying) => {
                    const current = playingKey.value;

                    playingKey.value = isPlaying ? key : current === key ? undefined : current;
                },
            });
    };
}

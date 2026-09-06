const extractOptionGroupWord = (key: string) => {
    const match = key.match(/^[a-z]+/);

    return match ? match[0] : key;
};

export const splitEntriesIntoGroups = <K, T extends Record<string, K>>(
    o: T,
    getGroupName: (key: string) => string = extractOptionGroupWord,
) => {
    const result: Record<string, Partial<T>> = {};

    for (const [key, value] of Object.entries(o) as [keyof T, T[keyof T]][]) {
        const group = getGroupName(key as string);

        result[group] ??= {};
        result[group][key] = value;
    }

    return result;
};

export const toGroupEntries = <K, T extends Record<string, K>>(groups: Record<string, Partial<T>>) =>
    Object.entries(groups).map(
        ([groupKey, groupValue]) => [groupKey, Object.keys(groupValue)] as [string, (keyof T)[]],
    );

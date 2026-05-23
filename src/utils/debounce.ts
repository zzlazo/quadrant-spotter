
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export const executeDebounced = (
    key: string,
    action: () => Promise<void>,
    delay = 500,
) => {
    if (debounceTimers[key]) {
        clearTimeout(debounceTimers[key]);
    }

    debounceTimers[key] = setTimeout(async () => {
        await action();
        delete debounceTimers[key];
    }, delay);
};
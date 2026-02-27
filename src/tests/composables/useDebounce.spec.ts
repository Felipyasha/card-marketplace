import { ref } from "vue";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { useDebounce } from "@/composables/useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("retorna o valor inicial imediatamente", () => {
        const source = ref("inicial");
        const debounced = useDebounce(source, 300);
        expect(debounced.value).toBe("inicial");
    });

    it("não atualiza antes do delay", async () => {
        const source = ref("inicial");
        const debounced = useDebounce(source, 300);

        source.value = "novo";
        await flushPromises();
        vi.advanceTimersByTime(200);

        expect(debounced.value).toBe("inicial");
    });

    it("atualiza após o delay", async () => {
        const source = ref("inicial");
        const debounced = useDebounce(source, 300);

        source.value = "novo";
        await flushPromises();
        vi.advanceTimersByTime(300);
        await flushPromises();

        expect(debounced.value).toBe("novo");
    });

    it("cancela atualizações anteriores se o valor mudar antes do delay", async () => {
        const source = ref("inicial");
        const debounced = useDebounce(source, 300);

        source.value = "primeiro";
        await flushPromises();
        vi.advanceTimersByTime(200);

        source.value = "segundo";
        await flushPromises();
        vi.advanceTimersByTime(300);
        await flushPromises();

        expect(debounced.value).toBe("segundo");
    });
});

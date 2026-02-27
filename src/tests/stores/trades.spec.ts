import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTradesStore } from "@/stores/trades";

vi.mock("@/api/trades", () => ({
    tradesApi: {
        getAll: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    },
}));

import { tradesApi } from "@/api/trades";

const mockTrade = {
    id: "trade-1",
    userId: "user-1",
    createdAt: "2024-01-01",
    user: { name: "Fulano" },
    tradeCards: [],
};

describe("useTradesStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it("inicia com lista vazia", () => {
        const trades = useTradesStore();
        expect(trades.trades).toEqual([]);
    });

    it("carrega trades", async () => {
        const trades = useTradesStore();

        vi.mocked(tradesApi.getAll).mockResolvedValue({
            list: [mockTrade],
            page: 1,
            rpp: 10,
            more: false,
        });

        await trades.fetchTrades(1);

        expect(trades.trades).toHaveLength(1);
        expect(trades.trades[0]?.user.name).toBe("Fulano");
    });

    it("cria uma trade", async () => {
        const trades = useTradesStore();

        vi.mocked(tradesApi.create).mockResolvedValue({ tradeId: "trade-1" });
        vi.mocked(tradesApi.getAll).mockResolvedValue({
            list: [mockTrade],
            page: 1,
            rpp: 10,
            more: false,
        });

        await trades.createTrade({ cards: [] });

        expect(tradesApi.create).toHaveBeenCalledWith({ cards: [] });
    });

    it("deleta uma trade da lista", async () => {
        const trades = useTradesStore();

        vi.mocked(tradesApi.getAll).mockResolvedValue({
            list: [mockTrade],
            page: 1,
            rpp: 10,
            more: false,
        });

        await trades.fetchTrades(1);

        vi.mocked(tradesApi.delete).mockResolvedValue(undefined);
        await trades.deleteTrade("trade-1");

        expect(trades.trades).toHaveLength(0);
    });
});

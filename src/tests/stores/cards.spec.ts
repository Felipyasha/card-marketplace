import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCardsStore } from "@/stores/cards";

vi.mock("@/api/cards", () => ({
    cardsApi: {
        getAll: vi.fn(),
        getMyCards: vi.fn(),
        addToMyCards: vi.fn(),
    },
}));

import { cardsApi } from "@/api/cards";

const mockCards = [
    {
        id: "1",
        name: "Card A",
        imageUrl: "http://img.com/a.jpg",
        description: "Descrição A",
        createdAt: "2024-01-01",
    },
    {
        id: "2",
        name: "Card B",
        imageUrl: "http://img.com/b.jpg",
        description: "Descrição B",
        createdAt: "2024-01-01",
    },
];

describe("useCardsStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it("inicia com listas vazias", () => {
        const cards = useCardsStore();
        expect(cards.allCards).toEqual([]);
        expect(cards.myCards).toEqual([]);
    });

    it("carrega todas as cartas", async () => {
        const cards = useCardsStore();

        vi.mocked(cardsApi.getAll).mockResolvedValue({
            list: mockCards,
            page: 1,
            rpp: 10,
            more: false,
        });

        await cards.fetchAllCards(1);

        expect(cards.allCards).toHaveLength(2);
        expect(cards.allCards.at(0).name).toBe("Card A");
    });

    it("carrega minhas cartas", async () => {
        const cards = useCardsStore();

        vi.mocked(cardsApi.getMyCards).mockResolvedValue(mockCards);

        await cards.fetchMyCards();

        expect(cards.myCards).toHaveLength(2);
        expect(cards.myCards.at(1).name).toBe("Card B");
    });

    it("adiciona cartas à coleção", async () => {
        const cards = useCardsStore();

        vi.mocked(cardsApi.getMyCards).mockResolvedValue(mockCards);
        vi.mocked(cardsApi.addToMyCards).mockResolvedValue(undefined);

        await cards.fetchMyCards();
        await cards.addCardsToMyCollection(["1"]);

        expect(cardsApi.addToMyCards).toHaveBeenCalledWith({ cardIds: ["1"] });
    });

    it("não busca novamente se cache ainda é válido", async () => {
        const cards = useCardsStore();

        vi.mocked(cardsApi.getAll).mockResolvedValue({
            list: mockCards,
            page: 1,
            rpp: 10,
            more: false,
        });

        await cards.fetchAllCards(1);
        await cards.fetchAllCards(1);

        expect(cardsApi.getAll).toHaveBeenCalledTimes(1);
    });
});

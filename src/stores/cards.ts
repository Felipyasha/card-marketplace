import { defineStore } from "pinia";
import { ref } from "vue";
import { cardsApi } from "@/api/cards";
import type { Card } from "@/types";
import { CACHE_TTL } from "@/config";

export const useCardsStore = defineStore("cards", () => {
    const allCards = ref<Card[]>([]);
    const allCardsPage = ref(1);
    const allCardsMore = ref(false);
    const allCardsLoading = ref(false);

    const myCards = ref<Card[]>([]);
    const myCardsLoading = ref(false);

    const cache = ref<Record<number, number>>({});

    async function fetchAllCards(page = 1, force = false) {
        const cached = cache.value[page];
        if (!force && cached && Date.now() - cached < CACHE_TTL) return;

        allCardsLoading.value = true;
        try {
            const data = await cardsApi.getAll(page);
            allCards.value =
                page === 1 ? data.list : [...allCards.value, ...data.list];
            allCardsPage.value = page;
            allCardsMore.value = data.more;
            cache.value[page] = Date.now();
        } finally {
            allCardsLoading.value = false;
        }
    }

    async function fetchMoreCards() {
        if (!allCardsMore.value || allCardsLoading.value) return;
        await fetchAllCards(allCardsPage.value + 1);
    }

    async function fetchMyCards() {
        myCardsLoading.value = true;
        try {
            myCards.value = await cardsApi.getMyCards();
        } finally {
            myCardsLoading.value = false;
        }
    }

    async function addCardsToMyCollection(cardIds: string[]) {
        await cardsApi.addToMyCards({ cardIds });
        await fetchMyCards();
    }

    async function fetchAllCardsAtOnce() {
        if (allCardsLoading.value) return;
        allCardsLoading.value = true;
        try {
            let page = 1;
            let hasMore = true;
            const result: Card[] = [];

            while (hasMore) {
                const data = await cardsApi.getAll(page, 50);
                result.push(...data.list);
                hasMore = data.more;
                page++;
            }

            allCards.value = result;
            allCardsMore.value = false;
        } finally {
            allCardsLoading.value = false;
        }
    }

    return {
        allCards,
        allCardsPage,
        allCardsMore,
        allCardsLoading,
        myCards,
        myCardsLoading,
        fetchAllCards,
        fetchMoreCards,
        fetchMyCards,
        addCardsToMyCollection,
        fetchAllCardsAtOnce,
    };
});

import { defineStore } from "pinia";
import { ref } from "vue";
import { tradesApi } from "@/api/trades";
import type { CreateTradePayload, Trade } from "@/types";

export const useTradesStore = defineStore("trades", () => {
    const trades = ref<Trade[]>([]);
    const page = ref(1);
    const more = ref(false);
    const loading = ref(false);

    async function fetchTrades(p = 1) {
        loading.value = true;
        try {
            const data = await tradesApi.getAll(p);
            trades.value =
                p === 1 ? data.list : [...trades.value, ...data.list];
            page.value = p;
            more.value = data.more;
        } finally {
            loading.value = false;
        }
    }

    async function fetchMoreTrades() {
        if (!more.value || loading.value) return;
        await fetchTrades(page.value + 1);
    }

    async function createTrade(payload: CreateTradePayload) {
        const { tradeId } = await tradesApi.create(payload);
        await fetchTrades(1);
        return tradeId;
    }

    async function deleteTrade(id: string) {
        await tradesApi.delete(id);
        trades.value = trades.value.filter((t) => t.id !== id);
    }

    return {
        trades,
        page,
        more,
        loading,
        fetchTrades,
        fetchMoreTrades,
        createTrade,
        deleteTrade,
    };
});

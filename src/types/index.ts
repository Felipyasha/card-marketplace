export interface User {
    id: string;
    name: string;
    email: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterResponse {
    userId: string;
}

export interface Card {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    createdAt: string;
}

export interface PaginatedCards {
    list: Card[];
    rpp: number;
    page: number;
    more: boolean;
}

export type TradeCardType = "OFFERING" | "RECEIVING";

export interface TradeCard {
    id: string;
    cardId: string;
    tradeId: string;
    type: TradeCardType;
    card: Card;
}

export interface Trade {
    id: string;
    userId: string;
    createdAt: string;
    user: { name: string };
    tradeCards: TradeCard[];
}

export interface PaginatedTrades {
    list: Trade[];
    rpp: number;
    page: number;
    more: boolean;
}

export interface CreateTradePayload {
    cards: Array<{
        cardId: string;
        type: TradeCardType;
    }>;
}

export interface AddCardsPayload {
    cardIds: string[];
}

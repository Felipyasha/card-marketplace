import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores/auth";

vi.mock("@/api/auth", () => ({
    authApi: {
        login: vi.fn(),
        register: vi.fn(),
        me: vi.fn(),
    },
}));

import { authApi } from "@/api/auth";

describe("useAuthStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("inicia sem usuário autenticado", () => {
        const auth = useAuthStore();
        expect(auth.isAuthenticated).toBe(false);
        expect(auth.user).toBeNull();
    });

    it("autentica o usuário após login", async () => {
        const auth = useAuthStore();

        vi.mocked(authApi.login).mockResolvedValue({
            token: "fake-token",
            user: { id: "1", name: "Fulano", email: "fulano@email.com" },
        });

        await auth.login("fulano@email.com", "123456");

        expect(auth.isAuthenticated).toBe(true);
        expect(auth.user?.name).toBe("Fulano");
        expect(localStorage.getItem("cv_token")).toBe("fake-token");
    });

    it("remove usuário após logout", async () => {
        const auth = useAuthStore();

        vi.mocked(authApi.login).mockResolvedValue({
            token: "fake-token",
            user: { id: "1", name: "Fulano", email: "fulano@email.com" },
        });

        await auth.login("fulano@email.com", "123456");
        auth.logout();

        expect(auth.isAuthenticated).toBe(false);
        expect(auth.user).toBeNull();
        expect(localStorage.getItem("cv_token")).toBeNull();
    });

    it("define isLoading durante o login", async () => {
        const auth = useAuthStore();
        let capturedLoading = false;

        vi.mocked(authApi.login).mockImplementation(async () => {
            capturedLoading = auth.isLoading;
            return {
                token: "fake-token",
                user: { id: "1", name: "Fulano", email: "fulano@email.com" },
            };
        });

        await auth.login("fulano@email.com", "123456");

        expect(capturedLoading).toBe(true);
        expect(auth.isLoading).toBe(false);
    });
});

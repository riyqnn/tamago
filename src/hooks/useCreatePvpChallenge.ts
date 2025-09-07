// hooks/useCreatePvpChallenge.ts
import { useMutation } from "@tanstack/react-query";

const BASE_URL = "https://tamago-seven.vercel.app";

export function useCreatePvpChallenge() {
  return useMutation({
    mutationFn: async (petId: string) => {
      const challengeId = crypto.randomUUID();

      // ruang tunggu PvP = halaman khusus
      const challengeUrl = `${BASE_URL}/pvp/${challengeId}?challenger=${petId}`;

      return { challengeId, challengeUrl };
    },
  });
}

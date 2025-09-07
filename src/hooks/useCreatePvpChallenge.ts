// hooks/useCreatePvpChallenge.ts
import { useMutation } from "@tanstack/react-query";

const BASE_URL = "https://tamago-seven.vercel.app";

export function useCreatePvpChallenge() {
  return useMutation({
    mutationFn: async (petId: string) => {
      // generate unique challengeId
      const challengeId = crypto.randomUUID();

      // link share yang langsung ke page pvp
      const challengeUrl = `${BASE_URL}/pvp/${challengeId}?challenger=${petId}`;

      return { challengeId, challengeUrl };
    },
  });
}

// hooks/useCreatePvpChallenge.ts
import { useMutation } from "@tanstack/react-query";

export function useCreatePvpChallenge() {
  return useMutation({
    mutationFn: async (petId: string) => {
      const challengeId = crypto.randomUUID();
      const challengeUrl = `${window.location.origin}/pvp/${challengeId}?challenger=${petId}`;

      return { challengeId, challengeUrl };
    },
  });
}

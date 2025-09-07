// hooks/useCreatePvpChallenge.ts
import { useMutation } from "@tanstack/react-query";

export function useCreatePvpChallenge() {
  return useMutation({
    mutationFn: async (petId: string) => {
      // generate challengeId random
      const challengeId = crypto.randomUUID();

      // bikin link yang bisa dishare
      const challengeUrl = `${window.location.origin}/pvp/${challengeId}?challenger=${petId}`;

      return { challengeId, challengeUrl };
    },
  });
}

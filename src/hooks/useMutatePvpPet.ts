import {
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";
import { queryKeyOwnedPet } from "./useQueryOwnedPet";

const mutateKeyPvpPet = ["mutate", "pvp-pet"];

type UseMutatePvpPetParams = {
  pet1: string; // object id pet user A
  pet2: string; // object id pet user B
};

export function useMutatePvpPet() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutateKeyPvpPet,
    mutationFn: async ({ pet1, pet2 }: UseMutatePvpPetParams) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::pvp_pet`,
        arguments: [
          tx.object(pet1), // &mut Pet (challenger)
          tx.object(pet2), // &mut Pet (opponent)
        ],
      });

      const { digest } = await signAndExecute({
        transaction: tx,
        chain: "sui:testnet",
      });

      const response = await suiClient.waitForTransaction({
        digest,
        options: { showEffects: true, showEvents: true },
      });

      if (response?.effects?.status.status === "failure") {
        throw new Error(response.effects.status.error);
      }

      return response;
    },
    onSuccess: (response) => {
      toast.success(`🎮 PvP finished! Tx: ${response.digest}`);
      // Refresh data Pet setelah PvP (exp/coins/energy berubah)
      queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
    },
    onError: (error: any) => {
      console.error("Error PvP pet:", error);
      toast.error(`Error PvP pet: ${error.message}`);
    },
  });
}

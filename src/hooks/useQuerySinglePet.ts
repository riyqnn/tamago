import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { normalizeSuiPetObject } from "@/lib/utils";

export const queryKeySinglePet = (petId?: string) => {
  if (petId) return ["single-pet", petId];
  return ["single-pet"];
};

export function useQuerySinglePet(petId?: string) {
  const suiClient = useSuiClient();
  
  return useQuery({
    queryKey: queryKeySinglePet(petId),
    queryFn: async () => {
      if (!petId) throw new Error("Pet ID is required");
      
      // Get the pet object by ID
      const petResponse = await suiClient.getObject({
        id: petId,
        options: { showContent: true },
      });

      if (!petResponse.data) return null;
      
      const normalizedPet = normalizeSuiPetObject(petResponse);
      if (!normalizedPet) return null;

      // Get dynamic fields to check if pet is sleeping
      const dynamicFields = await suiClient.getDynamicFields({
        parentId: normalizedPet.id,
      });

      const isSleeping = dynamicFields.data.some(
        (field) =>
          field.name.type === "0x1::string::String" &&
          field.name.value === "sleep_started_at",
      );

      return { ...normalizedPet, isSleeping };
    },
    enabled: !!petId, // Only run query if petId is provided
  });
}
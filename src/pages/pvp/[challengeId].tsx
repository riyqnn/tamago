"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutatePvpPet } from "@/hooks/useMutatePvpPet";

export default function PvpLobbyPage({ params }: { params: { challengeId: string } }) {
  const searchParams = useSearchParams();
  const challengerPetId = searchParams.get("challenger");
  const [opponentPetId, setOpponentPetId] = useState<string | null>(null);

  const { mutate: startPvp, isPending } = useMutatePvpPet();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">PvP Room: {params.challengeId}</h1>
      <p className="mt-2">Challenger Pet: {challengerPetId}</p>

      {/* Pilih pet untuk opponent */}
      <input
        type="text"
        placeholder="Enter your Pet ID"
        className="border p-2 mt-4"
        onChange={(e) => setOpponentPetId(e.target.value)}
      />

      <Button
        className="mt-4"
        disabled={!challengerPetId || !opponentPetId || isPending}
        onClick={() =>
          startPvp({ pet1: challengerPetId!, pet2: opponentPetId! })
        }
      >
        {isPending ? "Fighting..." : "Start Fight!"}
      </Button>
    </div>
  );
}

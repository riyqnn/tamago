import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PvpLobbyPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [searchParams] = useSearchParams();
  const challengerPetId = searchParams.get("challenger");

  const [opponentPetId, setOpponentPetId] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">PvP Lobby</h1>

      <div className="border p-4 rounded shadow w-full max-w-md space-y-3">
        <p>
          <strong>Challenge ID:</strong> {challengeId}
        </p>
        <p>
          <strong>Challenger Pet:</strong> {challengerPetId}
        </p>

        {!opponentPetId ? (
          <div className="space-y-2">
            <p>Connect wallet & pilih pet kamu untuk join battle:</p>
            <Button
              onClick={() =>
                setOpponentPetId("0xYourOpponentPetId") // nanti ini diganti pakai petId beneran dari wallet
              }
            >
              Join as Opponent
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Opponent Pet:</strong> {opponentPetId}
            </p>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                // TODO: panggil useMutatePvpPet({ pet1: challengerPetId, pet2: opponentPetId })
                alert(`Starting PvP battle... Pet1=${challengerPetId}, Pet2=${opponentPetId}`);
              }}
            >
              Start Battle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import {  useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Swords, 
  User, 
  Zap, 
  Copy, 
  Check,
  Loader2,
  Trophy,
  Shield,
  Users,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {

  TooltipProvider,

} from "@/components/ui/tooltip";
import Header from "@/components/Header";
import PetComponent from "@/pages/home/PetComponent";

// Import your actual hooks
import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useQuerySinglePet } from "@/hooks/useQuerySinglePet"; 
import { useMutatePvpPet } from "@/hooks/useMutatePvpPet";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function PvpLobbyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  
  const challengerPetId = searchParams.get("challenger");
  
  const [copied, setCopied] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [challengerApproved, setChallengerApproved] = useState(false);
  const [opponentApproved, setOpponentApproved] = useState(false);

  // Hooks
  const { data: myPet, isLoading: isLoadingMyPet, error: myPetError } = useQueryOwnedPet();
  const { data: challengerPet, isLoading: isLoadingChallengerPet } = useQuerySinglePet(challengerPetId);
  const { mutate: startPvpBattle, isPending: isStartingBattle } = useMutatePvpPet();

  const currentUrl = window.location.href;

  // Check if current user is the challenger
  const isChallenger = challengerPet && myPet && myPet.id === challengerPet.id;

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleApprove = (isApprover: boolean) => {
    if (isApprover) {
      setChallengerApproved(true);
    } else {
      setOpponentApproved(true);
    }
  };

  const handleStartBattle = () => {
  if (!myPet || !challengerPetId || !challengerApproved || !opponentApproved) return;

  setBattleStarted(true);

  startPvpBattle(
    { pet1: challengerPetId, pet2: myPet.id },
    {
      onSuccess: (response) => {
        toast.success(`Battle started! Tx: ${response.digest}`);
        setTimeout(() => {
          navigate('/pets');
        }, 2000);
      },
      onError: (error) => {
        console.error("Battle failed:", error);
        toast.error(error.message || "Failed to start battle");
        setBattleStarted(false);
      },
    }
  );
};


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoadingMyPet || isLoadingChallengerPet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-700">Loading battle lobby...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (myPetError || !challengerPet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Challenge Not Found</h2>
              <p className="text-gray-600 mb-4">This PvP challenge is invalid or has expired.</p>
              <Button onClick={() => navigate('/pets')} variant="outline">
                Back to My Pets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No wallet connected
  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Wallet Not Connected</h2>
              <p className="text-gray-600 mb-4">Please connect your wallet to join the PvP battle.</p>
              <p className="text-sm text-gray-500">Use the "Connect Wallet" button in the header above.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No pet available for current user
  if (!myPet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Pet Available</h2>
              <p className="text-gray-600 mb-4">You need to have a pet to participate in PvP battles.</p>
              <Button onClick={() => navigate('/pets')} variant="outline">
                Go to My Pets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if user's pet can battle
  const canMyPetBattle = !myPet.isSleeping && myPet.stats.energy > 20 && myPet.stats.hunger > 10;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex-grow flex p-4 pt-24">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Swords className="w-8 h-8 text-purple-600" />
                <h1 className="text-4xl font-bold text-gray-900">PvP Battle Lobby</h1>
                <Swords className="w-8 h-8 text-purple-600 scale-x-[-1]" />
              </div>
              <p className="text-gray-600 text-lg">Epic battle awaits! Get ready to fight!</p>
              
              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-mono text-orange-600">
                  Lobby expires in: {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Share Link Section - Show for challengers */}
            {isChallenger && (
              <Card className="mb-8 border-2 border-purple-200 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Your Challenge Link
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Share this link with your opponent to start the battle:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    💡 You are the challenger. Wait for an opponent to join, then both click "Ready!" to start battle.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Pet Battle Status Check */}
            {!canMyPetBattle && (
              <Card className="mb-8 border-2 border-yellow-200 bg-yellow-50">
                <CardContent className="p-6 text-center">
                  <XCircle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Pet Not Ready for Battle</h3>
                  <p className="text-yellow-700">
                    {myPet.isSleeping 
                      ? `${myPet.name} is sleeping and cannot battle right now.`
                      : `${myPet.name} is too weak to battle (needs more energy and food).`
                    }
                  </p>
                  <Button 
                    onClick={() => navigate('/pets')} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Care for Your Pet
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Battle Arena */}
            <Card className="border-2 border-red-200 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Battle Arena
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isChallenger ? (
                  // Challenger View: Show own pet on left, waiting for opponent on right
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Challenger Pet (Left) - Show own pet */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Your Pet (Challenger)</h3>
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <PetComponent pet={myPet} />
                        </div>
                        
                        {/* Challenger Approve Button */}
                        <div className="mt-4">
                          <Button
                            onClick={() => handleApprove(true)}
                            disabled={challengerApproved || battleStarted || !canMyPetBattle}
                            variant={challengerApproved ? "default" : "outline"}
                            className={challengerApproved ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {challengerApproved ? (
                              <><CheckCircle className="w-4 h-4 mr-2" />Ready!</>
                            ) : (
                              "I'm Ready!"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* VS Section (Center) */}
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">VS</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm">
                        Waiting for opponent to join...
                      </p>
                    </div>

                    {/* Opponent Slot (Right) - Empty until opponent joins */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Opponent</h3>
                        <div className="bg-gray-100 p-8 rounded-lg border-2 border-dashed border-gray-300">
                          <User className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500 text-sm">Waiting for opponent...</p>
                        </div>
                        
                        <div className="mt-4">
                          <div className="px-4 py-2 rounded text-sm bg-gray-100 text-gray-600">
                            Not joined yet
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Opponent View: Show challenger pet on left, own pet on right
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Challenger Pet (Left) */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Challenger</h3>
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <PetComponent pet={challengerPet} />
                        </div>
                        
                        {/* Challenger Status */}
                        <div className="mt-4">
                          <div className={`px-4 py-2 rounded text-sm ${
                            challengerApproved 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {challengerApproved ? 'Ready to battle!' : 'Waiting for challenger...'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VS Section (Center) */}
                    <div className="text-center">
                      <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">VS</span>
                      </div>
                      
                      {/* Start Battle Button */}
                      <Button
                        onClick={handleStartBattle}
                        disabled={
                          !canMyPetBattle ||
                          !challengerApproved || 
                          !opponentApproved || 
                          isStartingBattle || 
                          battleStarted ||
                          timeLeft <= 0
                        }
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
                      >
                        {isStartingBattle || battleStarted ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {battleStarted ? 'Battle in Progress...' : 'Starting Battle...'}
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-5 w-5" />
                            START BATTLE!
                          </>
                        )}
                      </Button>
                      
                      {!canMyPetBattle && (
                        <p className="text-red-600 text-sm mt-2">
                          Your pet must be healthy to battle
                        </p>
                      )}
                    </div>

                    {/* My Pet (Right) */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-red-600 mb-2">Your Pet (Opponent)</h3>
                        <div className="bg-red-50 p-2 rounded-lg">
                          <PetComponent pet={myPet} />
                        </div>
                        
                        {/* My Pet Approve Button */}
                        <div className="mt-4">
                          <Button
                            onClick={() => handleApprove(false)}
                            disabled={!canMyPetBattle || opponentApproved || battleStarted}
                            variant={opponentApproved ? "default" : "outline"}
                            className={opponentApproved ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {opponentApproved ? (
                              <><CheckCircle className="w-4 h-4 mr-2" />Ready!</>
                            ) : (
                              "I'm Ready!"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Battle Status */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    <strong>Battle Status:</strong> {challengerApproved ? '✅' : '⏳'} Challenger {opponentApproved ? '✅' : '⏳'} Opponent
                  </p>
                  {challengerApproved && opponentApproved && (
                    <p className="text-green-600 font-medium mt-1">Both players ready! Click START BATTLE!</p>
                  )}
                  {!challengerApproved && (
                    <p className="text-yellow-600 text-sm mt-1">Waiting for challenger to ready up...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
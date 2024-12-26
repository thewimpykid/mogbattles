"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface BattleData {
  battleNumer: number;
  lookmaxxerAName: string;
  lookmaxxerAImageUrl: string;
  votesForA: number;
  lookmaxxerBName: string;
  lookmaxxerBImageUrl: string;
  votesForB: number;
}

export default function Home() {
  const [leftVotes, setLeftVotes] = useState(0);
  const [rightVotes, setRightVotes] = useState(0);
  const [showVoteButton, setShowVoteButton] = useState(true);
  const [showVotes, setShowVotes] = useState(false);
  const [mogData, setMogData] = useState<BattleData[]>([]);
  const [previousBattles, setPreviousBattles] = useState<BattleData[]>([]);

  const buttonClickLeft = async () => {
    if (mogData.length === 0) return;
    try {
      setLeftVotes((prev) => prev + 1);
      await axios.post(`/api/vote?battleNumer=${mogData[0].battleNumer}&voteType=A`);
      Cookies.set(`voted_${mogData[0].battleNumer}`, "true", { expires: 7 });
      setShowVotes(true);
      setShowVoteButton(false);
    } catch (error) {
      console.error("Error voting for A:", error);
    }
  };

  const buttonClickRight = async () => {
    if (mogData.length === 0) return;
    try {
      setRightVotes((prev) => prev + 1);
      await axios.post(`/api/vote?battleNumer=${mogData[0].battleNumer}&voteType=B`);
      Cookies.set(`voted_${mogData[0].battleNumer}`, "true", { expires: 7 });
      setShowVotes(true);
      setShowVoteButton(false);
    } catch (error) {
      console.error("Error voting for B:", error);
    }
  };

  useEffect(() => {
    populateData();
    fetchData();
  }, []);

  const populateData = async () => {
    try {
      await axios.post("/api/populate");
    } catch (error) {
      console.error("Can't populate data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/get");
      const data: BattleData[] = await response.json();
      sortData(data);
    } catch (error) {
      console.error("Can't fetch data:", error);
    }
  };

  const sortData = (data: BattleData[]) => {
    const currentDate = Date.now();
    const savedDate = new Date("2024-12-25T12:00:00");
    const differenceInMilliseconds = currentDate - savedDate.getTime();
    const differenceInDays =
      Math.abs(Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24))) + 2;

    const newData = data.filter((item) => item.battleNumer === differenceInDays);
    setMogData(newData);

    const hasVoted = Cookies.get(`voted_${differenceInDays}`);
    if (hasVoted) {
      setShowVoteButton(false);
      setShowVotes(true);
    }

    const pastBattles = data.filter((item) => item.battleNumer < differenceInDays);
    setPreviousBattles(pastBattles);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mt-10 mb-2 text-white">MogBattles</h1>
      <h1 className="text-2xl italic mt-4 text-gray-500 mb-4">Who mogs?</h1>
      <div className="w-1/2 bg-gray-800 h-px my-4"></div>
      <h1 className="text-2xl text-gray-500 my-6">
        Day {mogData[0]?.battleNumer + 1 || "Loading..."} | Beta
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-4xl px-4 my-4">
        {/* Left Container */}
        <div className="flex flex-col items-center bg-black border border-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white py-8">
            {mogData.length > 0 ? (
              mogData[0].lookmaxxerAName
            ) : (
              <div className="w-40 h-6 bg-gray-700 rounded animate-pulse"></div>
            )}
          </h2>
          {mogData.length > 0 && (
            <img
              src={mogData[0].lookmaxxerAImageUrl}
              alt={mogData[0].lookmaxxerAName}
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
          )}
          {showVotes && (
            <p className="text-4xl font-semibold mt-4 text-gray-300 mb-8">
              Votes: <span className="text-green-400">{mogData[0]?.votesForA}</span>
            </p>
          )}
          {showVoteButton && (
            <div className="w-full">
              <div className="w-full bg-gray-800 h-px mt-8"></div>
              <button
                onClick={buttonClickLeft}
                className="bg-black text-white py-4 rounded-lg transition-all duration-200 ease-in-out text-2xl w-full border border-gray-900 hover:bg-gray-900"
              >
                Vote
              </button>
            </div>
          )}
        </div>
        {/* Right Container */}
        <div className="flex flex-col items-center bg-black border border-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white py-8">
            {mogData.length > 0 ? (
              mogData[0].lookmaxxerBName
            ) : (
              <div className="w-40 h-6 bg-gray-700 rounded animate-pulse"></div>
            )}
          </h2>
          {mogData.length > 0 && (
            <img
              src={mogData[0].lookmaxxerBImageUrl}
              alt={mogData[0].lookmaxxerBName}
              className="w-40 h-40 object-cover rounded-full mb-4"
            />
          )}
          {showVotes && (
            <p className="text-4xl font-semibold mt-4 text-gray-300 mb-8">
              Votes: <span className="text-green-400">{mogData[0]?.votesForB}</span>
            </p>
          )}
          {showVoteButton && (
            <div className="w-full">
              <div className="w-full bg-gray-800 h-px mt-8"></div>
              <button
                onClick={buttonClickRight}
                className="bg-black text-white py-4 rounded-lg transition-all duration-200 ease-in-out text-2xl w-full border border-gray-900 hover:bg-gray-900"
              >
                Vote
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Previous Results Section */}
      {previousBattles.length > 0 && (
        <div className="w-full max-w-xl px-4 mt-10">
          <h2 className="text-2xl font-semibold mb-8 text-white text-center">Previous Results</h2>
          <div className="flex flex-col items-center">
            {previousBattles.map((battle) => (
              <div
                key={battle.battleNumer}
                className="bg-black p-12 mb-4 w-full max-w-3xl border border-gray-800 rounded-lg shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <img
                      src={battle.lookmaxxerAImageUrl}
                      alt={battle.lookmaxxerAName}
                      className="w-20 h-20 object-cover rounded-full mb-2"
                    />
                    <p className="text-xl font-semibold text-white">
                      {battle.lookmaxxerAName}
                    </p>
                    <p className="text-lg text-gray-300 mt-2">
                      Votes: {battle.votesForA}
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-px h-32 bg-gray-800"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      src={battle.lookmaxxerBImageUrl}
                      alt={battle.lookmaxxerBName}
                      className="w-20 h-20 object-cover rounded-full mb-2"
                    />
                    <p className="text-xl font-semibold text-white">
                      {battle.lookmaxxerBName}
                    </p>
                    <p className="text-lg text-gray-300 mt-2">
                      Votes: {battle.votesForB}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

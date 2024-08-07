import React, { useState, useEffect } from "react";
import {
  Bracket,
  SeedItem,
  SeedTeam,
  SingleLineSeed,
  Seed,
} from "@sportsgram/brackets";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import Form from "./form";
import api from "../../config/axios";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";

const fetchPlayingTime = async (gameId) => {
  const response = await api.get(`/contest/game/${gameId}`);
  const timeSlot = response.data.timeSlot;
  const playingDate = response.data.playingDate;
  return playingDate + " " + timeSlot + ":00";
};

const fetchScores = async (gameId) => {
  const response = await api.get(`/score/${gameId}`);
  return response.data;
};

const generateRounds = (data, timeData, scoreData, totalMatches) => {
  const rounds = [];
  const roundData = {};

  data.forEach((game, index) => {
    const {
      round,
      gameId,
      firstPlayerId,
      secondPlayerId,
      scoreFirstPlayer,
      scoreSecondPlayer,
      firstPlayerName,
      secondPlayerName,
    } = game;

    const playingDate = timeData[index] || "Unknown";
    const setScore = scoreData[index];

    if (!roundData[round]) {
      roundData[round] = [];
    }

    roundData[round].push({
      id: gameId,
      teams: [
        {
          id: firstPlayerId,
          name: firstPlayerName,
          score: scoreFirstPlayer,
          setScore: setScore?.firstPlayerSetScore || 0,
        },
        {
          id: secondPlayerId,
          name: secondPlayerName,
          score: scoreSecondPlayer,
          setScore: setScore?.secondPlayerSetScore || 0,
        },
      ],
      playingDate,
    });
  });

  // Tổng số vòng đấu
  const totalRounds = Math.ceil(Math.log2(totalMatches + 1));

  // Số trận đấu tối đa trong vòng đầu tiên
  const initialMatches = Math.ceil(totalMatches / 2);

  for (let i = 1; i <= totalRounds; i++) {
    // Số trận đấu trong vòng hiện tại
    const matchesInRound = Math.ceil(initialMatches / Math.pow(2, i - 1));
    const roundSeeds = [];

    for (let j = 0; j < matchesInRound; j++) {
      if (roundData[i] && roundData[i][j]) {
        roundSeeds.push(roundData[i][j]);
      } else {
        roundSeeds.push({
          id: null,
          teams: [
            { id: null, name: "?", score: null, setScore: null },
            { id: null, name: "?", score: null, setScore: null },
          ],
          playingDate: "Unknown",
        });
      }
    }

    rounds.push({ seeds: roundSeeds });
  }

  return rounds;
};

const GamebyOwner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedSeedId, setSelectedSeedId] = useState("");
  const [hoveredSeed, setHoveredSeed] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [clubId, setClubId] = useState([]);
  const [totalRounds, setTotalRounds] = useState(0);
  // const contestId = sessionStorage.getItem("contestId");
  // sessionStorage.removeItem("contestId");

  const { id: contestId } = useParams();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (contestId != null) {
      fetchClubId();
      fetchGames();
      fetchContestDetails();
    }
  }, []);

  const fetchGames = async (contestId) => {
    console.log(contestId);
    const response = await api.get(`/contest/games/${contestId}`);
    return response.data;
  };

  const fetchContestDetails = async (contestId) => {
    const response = await api.get(`/contest/${contestId}`);
    return response.data;
  };

  const fetchClubId = async () => {
    const response = await api.get(`/contest/${contestId}`);
    setClubId(response.data.clubId);
  };

  useEffect(() => {
    const loadData = async () => {
      const [contestDetails, games] = await Promise.all([
        fetchContestDetails(contestId),
        fetchGames(contestId),
      ]);

      const totalMatches = contestDetails.capacity - 1;

      const timePromises = games.map((game) => fetchPlayingTime(game.gameId));
      const scorePromises = games.map((game) => fetchScores(game.gameId));

      const playingTime = await Promise.all(timePromises);
      const scores = await Promise.all(scorePromises);

      const updatedRounds = generateRounds(
        games,
        playingTime,
        scores,
        totalMatches
      );
      setRounds(updatedRounds);
      setTotalRounds(Math.ceil(Math.log2(totalMatches + 1)));
    };

    loadData();
  }, [contestId]);

  const handleMouseEnter = (seedId) => {
    setHoveredSeed(seedId);
  };

  const handleMouseLeave = () => {
    setHoveredSeed(null);
  };

  const handleSetTimeClick = (seedId) => {
    setMode("Time");
    setSelectedSeedId(seedId);
    setIsOpen(true);
    console.log(`Set Time for game ${seedId}`);
  };

  const handleSetScoreClick = (seedId) => {
    setMode("Score");
    setSelectedSeedId(seedId);
    setIsOpen(true);
    console.log(`Set Score for game ${seedId}`);
  };

  const handleFormClose = () => {
    setIsOpen(false);
  };

  const handleFormSubmit = async () => {
    const [contestDetails, games] = await Promise.all([
      fetchContestDetails(contestId),
      fetchGames(contestId),
    ]);
    const totalMatches = contestDetails.capacity - 1;
    const timePromises = games.map((game) => fetchPlayingTime(game.gameId));
    const scorePromises = games.map((game) => fetchScores(game.gameId));
    const playingDates = await Promise.all(timePromises);
    const scores = await Promise.all(scorePromises);

    const updatedRounds = generateRounds(
      games,
      playingDates,
      scores,
      totalMatches
    );
    setRounds(updatedRounds);
    setTotalRounds(Math.ceil(Math.log2(totalMatches + 1)));
    handleFormClose();
  };

  const renderRoundTitle = (roundIndex) => {
    const titleStyle = {
      backgroundColor: colors.greenAccent[800],
      color: colors.primary[100],
      padding: "10px",
      borderRadius: "5px",
      marginLeft: "10px",
      textAlign: "center",
    };

    if (roundIndex === totalRounds - 1) {
      return <div style={titleStyle}>Chung Kết</div>;
    } else if (roundIndex === totalRounds - 2) {
      return <div style={titleStyle}>Bán Kết</div>;
    } else {
      return <div style={titleStyle}>Vòng {roundIndex + 1}</div>;
    }
  };

  const CustomSeed = ({
    seed,
    breakpoint,
    roundIndex,
    seedIndex,
    isMiddleOfTwoSided,
  }) => {
    const Wrapper = isMiddleOfTwoSided ? SingleLineSeed : Seed;

    const getScoreBackgroundColor = (teamScore, opponentScore) => {
      return teamScore > opponentScore
        ? colors.greenAccent[400]
        : colors.grey[300];
    };

    return (
      <Wrapper
        mobileBreakpoint={breakpoint}
        style={{ fontSize: 12 }}
        onMouseEnter={() => handleMouseEnter(seed.id)}
        onMouseLeave={handleMouseLeave}
      >
        <SeedItem>
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            {seed.playingDate}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SeedTeam style={{ color: colors.redAccent[100] }}>
                {seed.teams[0]?.name || "Chưa có nhóm"}
              </SeedTeam>
              <span
                style={{
                  backgroundColor: getScoreBackgroundColor(
                    seed.teams[0]?.score,
                    seed.teams[1]?.score
                  ),
                  marginLeft: "8px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {seed.teams[0]?.score}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SeedTeam>{seed.teams[1]?.name || "Chưa có nhóm"}</SeedTeam>
              <span
                style={{
                  backgroundColor: getScoreBackgroundColor(
                    seed.teams[1]?.score,
                    seed.teams[0]?.score
                  ),
                  marginLeft: "8px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {seed.teams[1]?.score}
              </span>
            </div>
          </div>
          <div>
            {seed.id !== null && hoveredSeed === seed.id && (
              <>
                <button
                  className="action-button"
                  onClick={() => handleSetTimeClick(seed.id)}
                >
                  <ScheduleIcon />
                </button>
                <button
                  className="action-button"
                  onClick={() => handleSetScoreClick(seed.id)}
                >
                  <SportsScoreIcon />
                </button>
              </>
            )}
          </div>
        </SeedItem>
      </Wrapper>
    );
  };

  const getTeamNames = (seedId) => {
    const seed = rounds
      .flatMap((round) => round.seeds)
      .find((seed) => seed.id === seedId);
    return seed
      ? [seed.teams[0]?.name || "NO TEAM", seed.teams[1]?.name || "NO TEAM"]
      : ["NO TEAM", "NO TEAM"];
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      // flexDirection="column"
      // minHeight="100vh"
      p={2}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        maxWidth="1200px"
      >
        <Bracket
          rounds={rounds.map((round, index) => ({
            ...round,
            title: renderRoundTitle(index),
          }))}
          renderSeedComponent={CustomSeed}
          twoSided={false}
        />
      </Box>
      {isOpen && (
        <Form
          isOpen={isOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          mode={mode}
          seedId={selectedSeedId}
          getTeamNames={getTeamNames}
          clubId={clubId}
        />
      )}
    </Box>
  );
};

export default GamebyOwner;

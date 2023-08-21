import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { connectAPI } from "../api/utils";
import useGameStore from "../store/gameStore";
import { NewMovesRequest, NewMovesResponse } from "../types";
import { GLOBAL } from "../utils";

const fetchNewMovesTiles = async (
    request: NewMovesRequest
): Promise<NewMovesResponse> => {
    const { result, error } = await connectAPI<
        NewMovesRequest,
        NewMovesResponse
    >({
        method: "POST",
        endpoint: "/watch/new_moves",
        data: request,
    });
    if (error) {
        console.log(error);
        return { status: error };
    }
    return {
        moves: result?.moves ?? [],
        tiles: result?.tiles ?? [],
        loadingWeights: result?.loadingWeights,
    };
};

const useWatchGame = () => {
    const game = useGameStore((state) => state.game);
    const watchUser = useGameStore((state) => state.watchUser);
    const watchGame = useGameStore((state) => state.watchGame);
    const watchingNow = useGameStore((state) => state.watchingNow);
    const setWatchingNow = useGameStore((state) => state.setWatchingNow);
    const setLoadingWeights = useGameStore((state) => state.setLoadingWeights);
    const appendHistory = useGameStore((state) => state.appendHistory);

    const request: NewMovesRequest = {
        userName: watchUser,
        name: watchGame,
        numMoves: game.moves.length,
    };
    const { data } = useQuery<NewMovesResponse>(
        ["newMoves", request],
        () => fetchNewMovesTiles(request),
        {
            refetchInterval: GLOBAL.watchInterval,
            enabled: watchingNow,
        }
    );

    const moves = data?.moves || null;
    const tiles = data?.tiles ?? [];
    const loadingWeights = data?.loadingWeights ?? false;

    useEffect(() => {
        if (moves) {
            appendHistory(moves, tiles);
            if (moves[moves.length - 1] === -1) setWatchingNow(false);
        }
    }, [moves]);

    useEffect(() => {
        setLoadingWeights(loadingWeights);
    }, [loadingWeights]);
};

export default useWatchGame;

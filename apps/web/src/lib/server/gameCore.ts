"use server";

import { TTGameCore } from "@tt-crew/core";
import { Resource } from "sst";

// This is a server-only module that exports async functions
export async function getGameCore() {
  return new TTGameCore({
    url: Resource["TURSO_DATABASE_URL"].value,
    authToken: Resource["TURSO_AUTH_TOKEN"].value,
  });
}

// Helper functions that use the gameCore instance
export async function addMatch(input: { winnerId1: number; winnerId2?: number; enteredBy: number }) {
  const gameCore = await getGameCore();
  return gameCore.addMatch(input);
}

export async function addPlayer(input: { name: string; emoji: string; createdBy: number }) {
  const gameCore = await getGameCore();
  return gameCore.addPlayer(input);
}

export async function getAllPlayers() {
  const gameCore = await getGameCore();
  return gameCore.getAllPlayers();
}

export async function getActivePlayers() {
  const gameCore = await getGameCore();
  return gameCore.getActivePlayers();
}

export async function getPlayerById(id: number) {
  const gameCore = await getGameCore();
  return gameCore.getPlayerById(id);
}

export async function getMonthResult(date: Date) {
  const gameCore = await getGameCore();
  return gameCore.getMonthResult(date);
}

export async function publishMonthResult(date: Date) {
  const gameCore = await getGameCore();
  return gameCore.publishMonthResult(date);
} 
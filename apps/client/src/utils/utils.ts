import { GameMode } from '@eop/shared';

export async function copyToClipboard(text: string): Promise<void> {
  return await navigator.clipboard.writeText(text);
}

export function getRoundedClassForGameMode(gameMode: GameMode): string {
  return gameMode === GameMode.CUMULUS
    ? `card-rounded-cumulus`
    : `card-rounded`;
}

import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { listShipsAdmin } from "@/lib/cms/ships.functions";

const STORAGE_KEY = "cms.activeShipId";

/**
 * Every content module works on one ship at a time. The selection comes from
 * the database list (never a hardcoded slug) and is remembered per browser.
 */
export function useShipScope() {
  const fetchShips = useServerFn(listShipsAdmin);
  const shipsQuery = useQuery({ queryKey: ["cms", "ships"], queryFn: () => fetchShips() });
  const [shipId, setShipId] = useState<string | null>(null);

  const ships = shipsQuery.data?.ships ?? [];

  useEffect(() => {
    if (ships.length === 0) return;
    const stored = typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
    const valid = ships.find((s) => s.id === (shipId ?? stored))?.id ?? ships[0]!.id;
    if (valid !== shipId) setShipId(valid);
  }, [ships, shipId]);

  const select = (id: string) => {
    setShipId(id);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
  };

  return {
    ships,
    shipId,
    ship: ships.find((s) => s.id === shipId) ?? null,
    select,
    isPending: shipsQuery.isPending,
    error: shipsQuery.isError ? (shipsQuery.error as Error) : null,
  };
}

import { createFileRoute, Link } from "@tanstack/react-router";

import { ShipEditor } from "@/components/admin/ShipEditor";

export const Route = createFileRoute("/_authenticated/admin/ships/$shipId")({
  component: ShipEditRoute,
});

function ShipEditRoute() {
  const { shipId } = Route.useParams();
  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/ships" className="text-xs text-muted-foreground hover:underline">
          ← Danh sách tàu
        </Link>
        <h1 className="mt-2 text-xl font-semibold">Quản lý tàu</h1>
      </div>
      <ShipEditor shipId={shipId} />
    </div>
  );
}

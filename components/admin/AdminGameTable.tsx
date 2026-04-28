import type { Game } from "@/data/iq/types";
import AdminTable, { AdminTableHead, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminGameTable({ games }: { games: Game[] }) {
  return (
    <AdminTable className="rounded-2xl shadow-none">
      <AdminTableHead>
        <AdminTh>Game</AdminTh>
        <AdminTh>Category</AdminTh>
        <AdminTh>Age</AdminTh>
        <AdminTh>Difficulty</AdminTh>
        <AdminTh>Type</AdminTh>
        <AdminTh>Status</AdminTh>
      </AdminTableHead>
      <tbody>
        {games.slice(0, 12).map((game) => (
          <tr key={game.id} className="border-b border-slate-100 last:border-none">
            <AdminTd>
              <p className="font-bold text-slate-950">{game.title.fr}</p>
              <p className="text-xs text-slate-500">{game.slug}</p>
            </AdminTd>
            <AdminTd>{game.category}</AdminTd>
            <AdminTd>{game.ageGroup}</AdminTd>
            <AdminTd>{game.difficulty}</AdminTd>
            <AdminTd>{game.gameType}</AdminTd>
            <AdminTd>
              <StatusBadge tone={game.premium ? "warning" : "success"}>
                {game.premium ? "Premium" : "Free"}
              </StatusBadge>
            </AdminTd>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  );
}

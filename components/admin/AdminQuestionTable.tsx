import type { TestQuestion } from "@/data/iq/types";
import AdminTable, { AdminTableHead, AdminTd, AdminTh } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminQuestionTable({ questions }: { questions: TestQuestion[] }) {
  return (
    <AdminTable className="rounded-2xl shadow-none">
      <AdminTableHead>
        <AdminTh>Question</AdminTh>
        <AdminTh>Category</AdminTh>
        <AdminTh>Age</AdminTh>
        <AdminTh>Difficulty</AdminTh>
        <AdminTh>Type</AdminTh>
        <AdminTh>Points</AdminTh>
      </AdminTableHead>
      <tbody>
        {questions.slice(0, 12).map((question) => (
          <tr key={question.id} className="border-b border-slate-100 last:border-none">
            <AdminTd>
              <p className="max-w-md truncate font-bold text-slate-950">{question.question.fr}</p>
              <p className="text-xs text-slate-500">{question.id}</p>
            </AdminTd>
            <AdminTd>{question.category}</AdminTd>
            <AdminTd>{question.ageGroup}</AdminTd>
            <AdminTd>{question.difficulty}</AdminTd>
            <AdminTd>{question.type}</AdminTd>
            <AdminTd>
              <StatusBadge tone="info">{question.points} pts</StatusBadge>
            </AdminTd>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  );
}

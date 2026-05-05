import { useEffect, useState } from "react";
import { Flame, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { updateTaskStatus } from "@/utils/query-functions";
import { toast } from "sonner";

/* ---------------- CONSTANTS ---------------- */
const COLUMNS = {
  TODO: "Todo",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

/* ---------------- TYPES ---------------- */
interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
}

interface Card {
  id: string;
  title: string;
  column: string;
  description?: string;
}

/* ---------------- HELPERS ---------------- */
const taskToCard = (task: Task): Card => ({
  id: task.id.toString(),
  title: task.title,
  description: task.description,
  column:
    task.status === "todo"
      ? COLUMNS.TODO
      : task.status === "in_progress"
      ? COLUMNS.IN_PROGRESS
      : COLUMNS.COMPLETED,
});

/* ---------------- BOARD ---------------- */
export const Board = ({
  tasks,
  admin,
  projectId,
}: {
  tasks: Task[];
  admin?: boolean;
  projectId?: string;
}) => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatus(projectId!, taskId, status),
    onSuccess: () => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    setCards(tasks.map(taskToCard));
  }, [tasks]);

  return (
    <div className="flex gap-4 p-6">
      {Object.values(COLUMNS).map((col) => (
        <Column
          key={col}
          column={col}
          cards={cards}
          setCards={setCards}
          updateStatusMutation={updateStatusMutation}
          projectId={projectId}
        />
      ))}
      {admin && <BurnBarrel setCards={setCards} />}
    </div>
  );
};

/* ---------------- COLUMN ---------------- */
const Column = ({
  column,
  cards,
  setCards,
  updateStatusMutation,
  projectId,
}: any) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("cardId", id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");

    setCards((prev: Card[]) => {
      const updated = prev.map((c) =>
        c.id === cardId ? { ...c, column } : c
      );

      const movedCard = prev.find((c) => c.id === cardId);
      if (!movedCard) return prev;

      if (movedCard.column !== column && projectId) {
        const statusMap: any = {
          [COLUMNS.TODO]: "todo",
          [COLUMNS.IN_PROGRESS]: "in_progress",
          [COLUMNS.COMPLETED]: "done",
        };

        updateStatusMutation.mutate({
          taskId: cardId,
          status: statusMap[column],
        });
      }

      return updated;
    });

    setActive(false);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      className={`w-64 min-h-[400px] p-3 rounded ${
        active ? "bg-neutral-800" : "bg-neutral-900"
      }`}
    >
      <h3 className={`mb-3 font-semibold ${column === COLUMNS.TODO ? "text-blue-400" : column === COLUMNS.IN_PROGRESS ? "text-yellow-400" : "text-green-400"}`}>{column}</h3>

      {cards
        .filter((c: Card) => c.column === column)
        .map((card: Card) => (
          <Card
            key={card.id}
            card={card}
            handleDragStart={handleDragStart}
          />
        ))}
    </div>
  );
};

/* ---------------- CARD ---------------- */
const Card = ({ card, handleDragStart }: any) => {
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, card.id)}
      className="mb-2 p-2 bg-neutral-800 rounded cursor-grab"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="font-medium">{card.title}</p>
        </TooltipTrigger>
        <TooltipContent>
          {card.description || "No description"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

/* ---------------- DELETE ZONE ---------------- */
const BurnBarrel = ({ setCards }: any) => {
  const [active, setActive] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("cardId");
        setCards((prev: Card[]) => prev.filter((c) => c.id !== id));
        setActive(false);
      }}
      className={`w-64 h-40 flex items-center justify-center border rounded ${
        active ? "bg-red-500/20 border-red-500" : "border-neutral-600"
      }`}
    >
      {active ? <Flame /> : <Trash2 />}
    </div>
  );
};
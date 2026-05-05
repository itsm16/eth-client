import { useEffect, useState } from "react";
import { Flame, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  assigned_to?: number;
}

interface Card {
  title: string;
  role: string;
  id: string;
  column: string;
}

interface ColumnProps {
  title: string;
  headingColor: string;
  cards: Card[];
  column: string;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

interface CardProps {
  title: string;
  role: string;
  id: string;
  column: string;
  handleDragStart: (e: React.DragEvent, card: Card) => void;
}

interface DropIndicatorProps {
  beforeId: string | null;
  column: string;
}

interface BurnBarrelProps {
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

interface BoardProps {
  tasks: Task[];
}

const taskToCard = (task: Task): Card => ({
  id: task.id.toString(),
  title: task.title,
  role: task.status,
  column: task.status === "TODO" ? "Todo" :
    task.status === "IN_PROGRESS" ? "In progress" :
      task.status === "DONE" ? "Completed" : "rejected"
});

export const Board = ({ tasks, admin }: BoardProps & { admin?: boolean }) => {
  const [cards, setCards] = useState<Card[]>(tasks.map(taskToCard));

  useEffect(() => {
    setCards(tasks.map(taskToCard))
  }, [tasks])

  return (
    <div className="flex h-full w-full gap-3 overflow-hidden p-12">
      <Column
        title="Todo"
        column="Todo"
        headingColor="text-blue-200"
        cards={cards.filter(card => card.column === "Todo")}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="In progress"
        headingColor="text-orange-200"
        cards={cards.filter(card => card.column === "In progress")}
        setCards={setCards}
      />
      <Column
        title="Completed"
        column="completed"
        headingColor="text-emerald-200"
        cards={cards.filter(card => card.column === "completed")}
        setCards={setCards}
      />
      {admin && <BurnBarrel setCards={setCards} />}
    </div>
  );
};

const Column: React.FC<ColumnProps> = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);
  const queryClient = useQueryClient();

  const handleDragStart = (e: React.DragEvent, card: Card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();

    if (indicators.length === 0) {
      return;
    }

    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";


    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) {
        return;
      }

      const newColumn = column;
      cardToTransfer = { ...cardToTransfer, column: newColumn };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);

      // updateMutation.mutate({ id: cardId, status: newColumn });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: React.DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`)) as HTMLElement[];
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        {/* <AddCard column={column} setCards={setCards} /> */}
      </div>
    </div>
  );
};

const Card: React.FC<CardProps> = ({ title, role, id, column, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <div
        draggable="true"
        onDragStart={(e: React.DragEvent) => handleDragStart(e, { title, role, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 px-2 py-1 active:cursor-grabbing transition-all flex flex-col"
      >
        <div className="">
          <p className="font-semibold text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <p>{title}</p>
              </TooltipTrigger>
              <TooltipContent>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos ipsam eaque cum, temporibus veritatis perferendis placeat, molestias libero sit quo perspiciatis earum laboriosam illo consequuntur reprehenderit. Quaerat perferendis molestiae repellat.
              </TooltipContent>
            </Tooltip>
          </p>
        </div>
      </div>
    </>
  );
};

const DropIndicator: React.FC<DropIndicatorProps> = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel: React.FC<BurnBarrelProps> = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
        }`}
    >
      {active ? <Flame className="animate-bounce" /> : <Trash2 />}
    </div>
  );
};

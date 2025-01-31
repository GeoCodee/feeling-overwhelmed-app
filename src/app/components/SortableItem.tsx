"use client";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/app/types/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';

export function SortableItem({ id, task, setTasks }: { id: string, task: Task, setTasks: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-4 mb-2 relative"
    >
      <div className="flex justify-between items-center">
        <div {...listeners} className="cursor-grab active:cursor-grabbing">
          <span className="mr-4">☰</span>
          {task.text}
          <div className="flex gap-2 mt-2">
            {task.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTasks((prev: Task[]) => prev.filter(t => t.id !== task.id))}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
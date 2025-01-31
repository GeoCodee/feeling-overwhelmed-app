"use client";
import { useState, useEffect } from 'react';
import { TaskInput } from '@/app/components/TaskInput';
import { TaskList } from '@/app/components/TaskList';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Task } from '@/app/types/types';
import axios from 'axios';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiResults, setAiResults] = useState<{ prioritized: any[], suggestions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleProcessAI = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/process', { tasks });
      setAiResults(response.data);
    } catch (error) {
      console.error('AI Processing error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container py-8 grid md:grid-cols-2 gap-6">
      {/* Left Panel */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Overwhelmed?</h1>
        <TaskInput onAdd={(text, tags) => 
          setTasks(prev => [...prev, { id: Date.now().toString(), text, tags }])
        } />
        <TaskList tasks={tasks} setTasks={setTasks} />
      </div>

      {/* Right Panel */}
      <div className="space-y-6">
        <Button 
          onClick={handleProcessAI} 
          disabled={tasks.length === 0 || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Prioritize with AI'}
        </Button>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        ) : aiResults && (
          <>
            <Table className="border rounded-lg">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {aiResults.prioritized.map((task) => (
                  <tr key={task.id}>
                    <td>{tasks.find(t => t.id === task.id)?.text}</td>
                    <td>{task.priority}/10</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Accordion type="single" collapsible>
              {aiResults.suggestions.map((suggestion, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>Suggestion {index + 1}</AccordionTrigger>
                  <AccordionContent>{suggestion}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </div>
    </div>
  );
}
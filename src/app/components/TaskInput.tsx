"use client"

import{useState} from 'react'
import{Button} from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const TAGS = ["Work", "Personal", "Urgent", "Home"];

export function TaskInput({onAdd} : { onadd:(task:string,tags:string[])=> void}){
    const[input, setInput] = useState('');
    const[selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        if (input.trim()){
            onAdd(input, selectedTags);
            setInput('');
            setSelectedTags([]);
        }
    }


    return(
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='relative'>
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className='min-h-[120px]'
                    placeholder="What's overwhelming you?"
                />
                <div className='text-right text-sm mt-1 text-muted-foreground'>
                    {input.length}/500
                </div>
            </div>

            <div className='flex flex-wrap gap-2'>
                {TAGS.map((tag) =>(
                    <Badge
                        key={tag}
                        variant={selectedTags.includes(tag)?'default':'outline'}
                        className='cursor-pointer'
                        onClick={()=>setSelectedTags(prev=>
                            prev.includes(tag) ? prev.filter(t=>t !== tag): [...prev, tag]
                        )}
                    >
                        {tag}
                    </Badge>
                ))}
            </div>

            <motion.div whileHover={{scale:1.05}}>
                <Button type="submit" className='w-full'>
                    Add Task
                </Button>
            </motion.div>
        </form>
    )
}
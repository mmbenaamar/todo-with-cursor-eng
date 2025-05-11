"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Trash2, X, Check } from "lucide-react"

// Define the Task type
type Task = {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  // State for tasks and new task input
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Add a new task
  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
      }
      setTasks([...tasks, newTask])
      setNewTaskText("")
    }
  }

  // Toggle task completion status
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  // Start editing a task
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditText(task.text)
  }

  // Save edited task
  const saveEdit = () => {
    if (editingTaskId && editText.trim()) {
      setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, text: editText.trim() } : task)))
      setEditingTaskId(null)
      setEditText("")
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditText("")
  }

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-bold text-center">My Todo List</h1>
      </header>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="p-4 border-b">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </div>
      </form>

      {/* Task List */}
      <ul className="divide-y">
        {tasks.length === 0 ? (
          <li className="p-4 text-center text-muted-foreground">No tasks yet. Add one above!</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="p-4 flex items-center justify-between gap-2">
              {editingTaskId === task.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1" autoFocus />
                  <Button size="icon" variant="ghost" onClick={saveEdit} className="h-8 w-8">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      id={`task-${task.id}`}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.text}
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEditing(task)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteTask(task.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        <p>Todo List App | {new Date().getFullYear()}</p>
        <p>
          {tasks.length} task(s) | {tasks.filter((t) => t.completed).length} completed
        </p>
      </footer>
    </div>
  )
}

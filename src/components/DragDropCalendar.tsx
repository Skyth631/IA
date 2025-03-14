import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface CalendarProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newDate: Date) => void;
  onTaskComplete: (taskId: string) => void;
}

export default function DragDropCalendar({ tasks, onTaskMove, onTaskComplete }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newDate = new Date(result.destination.droppableId);
    onTaskMove(taskId, newDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="grid grid-cols-7 gap-4 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-4">
          {days.map(day => (
            <Droppable key={format(day, 'yyyy-MM-dd')} droppableId={format(day, 'yyyy-MM-dd')}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[120px] rounded-lg p-2 transition-colors ${
                    isSameMonth(day, today)
                      ? 'bg-gray-50'
                      : 'bg-gray-100'
                  } ${
                    snapshot.isDraggingOver
                      ? 'bg-teal-50 ring-2 ring-teal-500'
                      : ''
                  }`}
                >
                  <div className="text-right mb-2">
                    <span className={`inline-block rounded-full w-6 h-6 text-center leading-6 text-sm ${
                      format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                        ? 'bg-teal-500 text-white'
                        : 'text-gray-600'
                    }`}>
                      {format(day, 'd')}
                    </span>
                  </div>

                  <AnimatePresence>
                    {tasks
                      .filter(task => format(task.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`mb-2 p-2 rounded-md text-sm ${
                                snapshot.isDragging
                                  ? 'shadow-lg ring-2 ring-teal-500'
                                  : 'shadow'
                              } ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              } ${
                                task.completed ? 'opacity-50' : ''
                              }`}
                              onClick={() => setSelectedDate(day)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">{task.title}</span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onTaskComplete(task.id);
                                  }}
                                  className="ml-2 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                                >
                                  {task.completed && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-2 h-2 rounded-full bg-current"
                                    />
                                  )}
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">
                Tasks for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <div className="space-y-2">
                {tasks
                  .filter(task => format(task.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                  .map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-3 rounded-lg ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{task.title}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onTaskComplete(task.id)}
                          className="ml-2 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        >
                          {task.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 rounded-full bg-current"
                            />
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 
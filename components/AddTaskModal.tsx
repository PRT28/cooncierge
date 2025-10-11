import React, { useState } from "react";
import Modal from "./Modal";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (task: any) => void;
  onEdit?: (task: any) => void;
  initialData?: any;
  isEditMode?: boolean;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onEdit,
  initialData = {},
  isEditMode = false,
}) => {
  const [nature, setNature] = useState(initialData.nature || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [subTasks, setSubTasks] = useState<string[]>(
    initialData.subTasks || [
      "Database Optimization",
      "Payment Pending",
      "Follow Up",
    ]
  );
  const [comments, setComments] = useState(initialData.comments || "");
  const [assignee, setAssignee] = useState(initialData.assignee || "");
  const [assignedBy, setAssignedBy] = useState(initialData.assignedBy || "");
  const [startDate, setStartDate] = useState(initialData.startDate || "");
  const [dueDate, setDueDate] = useState(initialData.dueDate || "");
  const [priority, setPriority] = useState(initialData.priority || "");

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, "Lorem Ipsum"]);
  };

  const handleSave = () => {
    const task = {
      nature,
      description,
      subTasks,
      comments,
      assignee,
      assignedBy,
      startDate,
      dueDate,
      priority,
    };
    if (isEditMode && onEdit) onEdit(task);
    else if (onSave) onSave(task);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tasks"
      size="sm"
      customWidth="w-[1000px]"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200">
          {/* Nature of Task */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nature of task
            </label>
            <select
              className="w-[300px] px-3 py-2 border border-gray-300 rounded-md "
              value={nature}
              onChange={(e) => setNature(e.target.value)}
            >
              <option value="">Select task nature</option>
            </select>
          </div>

          {/* Create Sub Tasks Button */}
          <div className=" -mt-14 flex justify-end">
            <button
              type="button"
              className="border border-green-900 text-green-900 font-semibold px-4 py-2 rounded-md hover:bg-green-50 transition"
              onClick={handleAddSubTask}
            >
              + Create Sub Tasks
            </button>
          </div>

          {/* Task Description */}
          <div className="mb-4 mt-10">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md  resize-none min-h-[80px]"
              placeholder="Enter your Task description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Sub Tasks */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sub Tasks
            </label>
            <div className="flex flex-wrap gap-2">
              {subTasks.map((task, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm"
                >
                  {task}
                </span>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md  resize-none min-h-[60px]"
              placeholder="Enter your comments here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-80 bg-white rounded-lg p-4 border border-gray-200 flex flex-col gap-4">
          {/* Assignee */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assignee
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Select Assignee</option>
            </select>
          </div>
          {/* Assigned By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assigned By
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
              value={assignedBy}
              onChange={(e) => setAssignedBy(e.target.value)}
            >
              <option value="">Select Assigned by</option>
            </select>
          </div>
          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">Select Priority</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="flex items-center gap-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
              onClick={isEditMode ? handleSave : undefined}
              disabled={!isEditMode}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5h2M12 7v10m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Edit
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-4 py-2 bg-green-900 text-white rounded-md hover:bg-green-800 transition"
              onClick={handleSave}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddTaskModal;

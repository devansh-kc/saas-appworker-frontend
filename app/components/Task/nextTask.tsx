"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoaderPinwheelIcon } from "lucide-react";
import { BACKEND_URL } from "../../../utils/utils";

interface Task {
  id: number;
  amount: number;
  title: string;
  options: {
    id: number;
    image_url: string;
    task_id: number;
  }[];
}
function NextTask() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setIsSubmiiting] = useState(true);

  async function fetchNextTask() {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/v1/worker/next-task`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setCurrentTask(response.data.data);
    } catch (error) {
      setLoading(false);
      setCurrentTask(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNextTask();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen  items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LoaderPinwheelIcon className="h-12 w-12 animate-spin" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  if (!currentTask) {
    return (
      <div className="flex h-screen  items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-4xl font-bold font-mono">
            please check back in some time , there are no pending tasks at this
            moment
          </p>
        </div>
      </div>
    );
  }

  async function onSelectOption(optionid: string) {
    try {
      setIsSubmiiting(true);
      const result = await axios.post(
        `${BACKEND_URL}/v1/worker/submit-task`,
        {
          taskId: currentTask?.id.toString(),
          selection: optionid,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const nextTask = result.data.data.nextTask;
      if (nextTask) {
        setCurrentTask(nextTask);
      } else {
        setCurrentTask(null);
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <div>
      <div className=" grid text-2xl pt-20  justify-center p-4 m-4 ">
        <h1 className="text-bold text-center p-2 m-2">{currentTask.title}</h1>
        <div className="flex justify-center pt-8">
          {currentTask.options.map((option) => {
            return (
              <Option
                key={option.id}
                onSelect={() => onSelectOption(String(option.id))}
                imageUrl={option.image_url}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
function Option({
  imageUrl,
  onSelect,
}: {
  imageUrl: string;
  onSelect: () => void;
}) {
  return (
    <div>
      <img
        onClick={onSelect}
        className={"p-2 w-96 rounded-md"}
        src={imageUrl}
      />
    </div>
  );
}
export default NextTask;

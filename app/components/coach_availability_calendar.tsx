'use client';

import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent, EventActions } from "@aldabil/react-scheduler/types";
import { WeekProps } from "@aldabil/react-scheduler/views/Week";
import React, { useEffect, useState } from "react";
import axios from "axios";

type CoachAvailability = {
  id: number;
  startTime: Date;
  EndTime: Date; //TODO: Fix typo in migration here :/
  createdAt: Date;
  updatedAt: Date;
  coachId: number;
};

interface CoachAvailabilityProps {
  userId: number;
  coachName: String;
}

export const CoachAvailability: React.FC<CoachAvailabilityProps> = ({
  userId,
  coachName,
}) => {
  const [coachAvailabilities, setCoachAvailabilities] = useState<
    CoachAvailability[]
  >([]);

  useEffect(() => {
    const fetchCoachAvailability = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/coach_availability",
          {
            params: {
              coachId: userId,
            },
          }
        );
        setCoachAvailabilities(response.data);
      } catch (error) {
        console.error("Error fetching coach availability:", error);
      }
    };

    fetchCoachAvailability();
  }, [userId]);

  const handleEventConfirm = async (
    event: ProcessedEvent,
    action: EventActions
  ) => {
    if (action === "create") {
      try {
        const startTime = new Date(event.start);
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 2); //This is a work around until we can make this work through the picker logic.

        event.end = endTime;

        const newAvailability = {
          startTime: startTime,
          EndTime: endTime,
          coachId: userId,
        };

        const response = await axios.put(
          "http://localhost:3000/api/coach_availability",
          newAvailability
        );

        setCoachAvailabilities((prevState) =>
          response.status === 201 ? [...prevState, response.data] : prevState
        );
      } catch (error) {
        console.error("Error adding new availability:", error);
      }
    }
    if (action === "edit") {
      handleEventEdit(event);
    }

    return event;
  };

  const handleEventDrop = async (
    event: React.DragEvent<HTMLButtonElement>,
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ) => {
    handleEventEdit(updatedEvent);
  };

  const handleEventEdit = async (updatedEvent: ProcessedEvent) => {
    try {
      const startTime = new Date(updatedEvent.start);
      const endTime = new Date(updatedEvent.end);

      const updatedAvailability = {
        id: updatedEvent.event_id,
        startTime: startTime,
        EndTime: endTime,
        coachId: userId,
      };

      const response = await axios.post(
        `http://localhost:3000/api/coach_availability`,
        updatedAvailability
      );
      console.log("test");
      console.log(response.status);
      setCoachAvailabilities((prevState) =>
        prevState.map(
          (avail) => (response.status = 200 ? response.data : avail)
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleEventDelete = async (deletedEventId: Number | String) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/coach_availability?id=${deletedEventId}`
      );

      setCoachAvailabilities((prevState) =>
        prevState.filter((avail) => avail.id !== deletedEventId)
      );
    } catch (error) {
      console.error("Error deleting availability:", error);
    }
  };

  const events: ProcessedEvent[] = coachAvailabilities.map((availability) => ({
    event_id: availability.id, // Unique identifier
    title: `Coach ${coachName} Availability`,
    start: new Date(availability.startTime),
    end: new Date(availability.EndTime),
    allDay: false,
  }));

  const weekSettings: WeekProps = {
    weekDays: [0, 1, 2, 3, 4, 5],
    weekStartOn: 0,
    startHour: 8,
    endHour: 21,
    step: 60,
    navigation: false,
    disableGoToDay: true,
  };

  return (
    <Scheduler
      view="week"
      disableViewNavigator={true}
      week={weekSettings}
      events={events}
      onEventDrop={handleEventDrop}
      onConfirm={handleEventConfirm}
      onDelete={handleEventDelete}
    />
  );
};

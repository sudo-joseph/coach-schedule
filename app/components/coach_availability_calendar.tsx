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

        console.log("Sending body:", newAvailability);

        const response = await axios.put(
          "http://localhost:3000/api/coach_availability",
          newAvailability
        );
        setCoachAvailabilities((prevState) =>
          prevState.map((avail) =>
            avail.id === event.event_id ? response.data : avail
          )
        );
      } catch (error) {
        console.error("Error adding new availability:", error);
      }
    }
    return event;
  };

  const handleEventDrop = async (
    event: React.DragEvent<HTMLButtonElement>, // Drag event from the button
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ) => {
    console.log("here");
    console.log(event);
    console.log(droppedOn);
    console.log(originalEvent);
    console.log(updatedEvent);
    try {
      const startTime = new Date(updatedEvent.start);
      const endTime = new Date(updatedEvent.end);

      const updatedAvailability = {
        id: updatedEvent.event_id,
        startTime: startTime,
        EndTime: endTime,
        coachId: userId,
      };

      console.log(updatedAvailability);

      // Send PUT request to update the availability on the server
      const response = await axios.post(
        `http://localhost:3000/api/coach_availability`,
        updatedAvailability
      );

      // Update local state with the updated availability
      setCoachAvailabilities((prevState) =>
        prevState.map((avail) =>
          avail.id === updatedEvent.event_id ? response.data : avail
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };
  //   try {
  //     const startTime = new Date(updatedEvent.start);
  //     const endTime = new Date(startTime);
  //     endTime.setHours(startTime.getHours() + 2); //This is a work around until we can make this work through the picker logic.

  //     const newAvailability = {
  //       startTime: startTime,
  //       EndTime: endTime,
  //       coachId: userId,
  //     };

  //     const response = await axios.post('http://localhost:3000/api/coach_availability', newAvailability);
  //     setCoachAvailabilities(prevState => prevState.map(avail =>
  //       avail.id === updatedEvent.event_id ? response.data : avail
  //     ));
  //   } catch (error) {
  //     console.error('Error adding new availability:', error);
  //   }
  // };

  // const handleEventEdit = async (updatedEvent: ProcessedEvent) => {
  //   try {
  //     const startTime = new Date(updatedEvent.start);
  //     const endTime = new Date(startTime);
  //     endTime.setHours(startTime.getHours() + 2);

  //     const updatedAvailability = {
  //       startTime: startTime,
  //       EndTime: endTime,
  //       coachId: userId,
  //     };

  //     // Send PUT request to update the availability on the server
  //     const response = await axios.put(
  //       `http://localhost:3000/api/coach_availability/${updatedEvent.event_id}`,
  //       updatedAvailability
  //     );

  //     // Update local state with the updated availability
  //     setCoachAvailabilities((prevState) =>
  //       prevState.map((avail) =>
  //         avail.id === updatedEvent.event_id ? response.data : avail
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating availability:", error);
  //   }
  // };

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
    startHour: 9,
    endHour: 17,
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

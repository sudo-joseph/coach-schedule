'use client';

import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { WeekProps } from "@aldabil/react-scheduler/views/Week";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type CoachAvailability = {
  id: number;
  startTime: Date;
  EndTime: Date; //Typo in migration here :/ 
  createdAt: Date;
  updatedAt: Date;
  coachId: number;
};

interface CoachAvailabilityProps {
  userId: number;
  coachName: String;
}


export const CoachAvailability: React.FC<CoachAvailabilityProps> = ({ userId, coachName }) => {
  
  const [coachAvailabilities, setCoachAvailabilities] = useState<CoachAvailability[]>([]);

  useEffect(() => {
    const fetchCoachAvailability = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/coach_availability', {
          params: {
            coachId: userId,
          },
        });
        setCoachAvailabilities(response.data);
      } catch (error) {
        console.error('Error fetching coach availability:', error);
      }
    };

    fetchCoachAvailability();
  }, [userId]); 
    
  const events: ProcessedEvent[] = coachAvailabilities.map((availability) => ({
    event_id: availability.id, // Unique identifier
    title: `Coach ${coachName} Availability`,
    start: new Date(availability.startTime), 
    end: new Date(availability.EndTime),
    allDay: false, 
  }));

  console.log(events)

  const weekSettings: WeekProps = { 
    weekDays: [0, 1, 2, 3, 4, 5], 
    weekStartOn: 0, 
    startHour: 9, 
    endHour: 17,
    step: 30,
    navigation: false,
    disableGoToDay: true
  };

  return (  
    <Scheduler 
      view="week"
      week={weekSettings}
      events={events} // Pass transformed events
    //   onEventAdd={(event) => {
    //     console.log("Event Added:", event);
    //     // Handle event addition logic here (e.g., API call)
    //   }}
    //   onEventUpdate={(event) => {
    //     console.log("Event Updated:", event);
    //     // Handle event update logic here
    //   }}
    //   onEventDelete={(eventId) => {
    //     console.log("Event Deleted:", eventId);
    //     // Handle event deletion logic here
    //   }}
    />
  );
};

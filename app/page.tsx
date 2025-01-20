import { CoachAvailability } from "./components/coach_availability_calendar";
import { PageHeader } from "./components/page_header";


export default function Home() {

  const userId = 1; // TODO fix this
  const coachName = 'Alice' 
  
  
  return (
    <>
    <PageHeader/>
    <CoachAvailability userId={userId} coachName={coachName}/>
  </>);
}

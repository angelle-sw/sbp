import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEvent } from './redux/actions';
import { DebugInfo } from './DebugInfo';

type Props = {
  addEvent: typeof addEvent;
  eligibleEventsCount: number;
};

export const AddEvent = ({ addEvent, eligibleEventsCount }: Props) => {
  const navigate = useNavigate();

  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [startTime, setStartTime] = useState('');

  const addNewEvent = (event: React.FormEvent) => {
    event.preventDefault();

    addEvent(eligibleEventsCount + 1, option1, option2, 0, [1, 1], 1614643200);

    setOption1('');
    setOption2('');
    setStartTime('');
  };

  return (
    <div>
      Add Event
      <form onSubmit={addNewEvent}>
        <div>
          <label>Option 1</label>
          <input onChange={event => setOption1(event.target.value)} value={option1} />
        </div>

        <div>
          <label>Option 2</label>
          <input onChange={event => setOption2(event.target.value)} value={option2} />
        </div>

        <div>
          <label>Start Time</label>
          <input onChange={event => setStartTime(event.target.value)} value={startTime} />
        </div>

        <button type="submit">Add Event</button>
      </form>
      <button onClick={() => navigate('/')} type="button">
        Back
      </button>
      <DebugInfo />
    </div>
  );
};

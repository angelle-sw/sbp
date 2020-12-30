import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getSbpContract from './sbp';
import { DebugInfo } from './DebugInfo';

export const AddEvent = () => {
  const navigate = useNavigate();

  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [startTime, setStartTime] = useState('');

  const addEvent = async (event: React.FormEvent) => {
    event.preventDefault();

    const sbp = await getSbpContract();

    await sbp.addEvent(option1, option2, 1614643200);
    setOption1('');
    setOption2('');
    setStartTime('');
  };

  return (
    <div>
      Add Event
      <form onSubmit={addEvent}>
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

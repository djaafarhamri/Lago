import './ComputerSettings.css'

const ComputerSettings = ({ level, setLevel }) => {
  return (
    <div className="ComputerSettings">
      <div className="title">
        <h2>Computer Settings</h2>
      </div>
      <h3>Computer Level</h3>
      <div className="range">
        <input
          type="range"
          defaultValue={0}
          min={0}
          max={4}
          onChange={(e) => {
              setLevel(e.target.value);
            }}
            />
        <p>{level}</p>
      </div>
    </div>
  );
};

export default ComputerSettings;

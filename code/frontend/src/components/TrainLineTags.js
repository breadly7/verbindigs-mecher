const TrainLineTags = ({ counts }) => (
    <div className="flex flex-wrap mb-2">
        {counts.map(([line, count]) => (
            <span key={line} className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 mb-1 px-2.5 py-0.5 rounded">
                {line}: {count}
            </span>
        ))}
    </div>
);

export default TrainLineTags;
const TrainLineTags = ({ counts, onTagClick, activeTag }) => (
    <div className="flex flex-wrap mb-2">
        {counts.map(([line, count]) => {
            const isActive = line === activeTag;
            return (
                <button
                    key={line}
                    className={`cursor-pointer text-xs font-semibold mr-2 mb-1 px-2.5 py-0.5 rounded ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800'}`}
                    onClick={() => onTagClick(line)}
                    style={{ userSelect: 'none' }}
                >
                    {line}: {count}
                </button>
            );
        })}
    </div>
);

export default TrainLineTags;
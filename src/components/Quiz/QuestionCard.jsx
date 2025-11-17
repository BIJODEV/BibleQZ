import React from 'react';

const QuestionCard = ({ question, index, onUpdate, onRemove, onOptionUpdate, onNumberOfOptionsChange }) => {
  const optionLabels = ['A', 'B', 'C', 'D'];

  const handleNumberOfOptionsChange = (e) => {
    const newNumber = parseInt(e.target.value);
    onNumberOfOptionsChange(newNumber);
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-bible-blue">
          Question {index + 1}
        </h3>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 font-semibold text-sm w-fit sm:w-auto"
        >
          Remove Question
        </button>
      </div>

      {/* Question Input */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <textarea
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue text-sm sm:text-base"
          rows="3"
          placeholder="Enter your question here..."
        />
      </div>

      {/* Number of Options Selector */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Options
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <select
            value={question.numberOfOptions || 4}
            onChange={handleNumberOfOptionsChange}
            className="w-full sm:w-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue text-sm sm:text-base"
          >
            <option value={2}>2 Options</option>
            <option value={3}>3 Options</option>
            <option value={4}>4 Options</option>
          </select>
          <p className="text-xs sm:text-sm text-gray-500">
            Choose how many options this question should have
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-4 sm:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options (Select the correct answer) *
        </label>
        
        {question.options.map((option, optionIndex) => {
          const isActive = optionIndex < question.numberOfOptions;
          const optionLabel = optionLabels[optionIndex];
          
          return (
            <div 
              key={optionIndex} 
              className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 rounded-lg ${
                isActive ? 'bg-white' : 'bg-gray-50 opacity-60'
              }`}
            >
              {/* Radio + Label Container */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctAnswer === optionIndex}
                  onChange={() => onUpdate({ correctAnswer: optionIndex })}
                  className="h-5 w-5 text-bible-blue focus:ring-bible-blue border-gray-300 flex-shrink-0"
                  disabled={!isActive}
                />
                
                <span className={`font-semibold w-6 text-center ${isActive ? 'text-bible-blue' : 'text-gray-400'} flex-shrink-0`}>
                  {optionLabel}
                </span>
              </div>
              
              {/* Option Input */}
              <input
                type="text"
                value={option}
                onChange={(e) => onOptionUpdate(optionIndex, e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue text-sm sm:text-base ${
                  isActive 
                    ? 'border-gray-300 bg-white' 
                    : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
                placeholder={
                  isActive 
                    ? `Option ${optionLabel}` 
                    : 'Disabled (reduce options above)'
                }
                disabled={!isActive}
              />
            </div>
          );
        })}
      </div>

      {/* Explanation (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation (Optional)
        </label>
        <textarea
          value={question.explanation}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bible-blue focus:border-bible-blue text-sm sm:text-base"
          rows="2"
          placeholder="Add explanation for the correct answer..."
        />
      </div>
    </div>
  );
};

export default QuestionCard;
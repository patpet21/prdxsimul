
import React, { useState } from 'react';
import { QuizData } from '../../types';
import { generateQuiz } from '../../services/mockAiService';
import { Button } from '../ui/Button';

interface QuizModuleProps {
  topic: string;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ topic }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    const data = await generateQuiz(topic);
    if (data) {
      setQuizData(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
      setIsCorrect(null);
    }
    setLoading(false);
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent double answer
    setSelectedOption(optionIndex);
    
    const correct = optionIndex === quizData?.questions[currentQuestionIndex].correctIndex;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (!quizData) return;
    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-indigo-600 font-bold animate-pulse">AI is crafting your quiz...</p>
        <p className="text-xs text-slate-400 mt-2">Generating 3 questions about {topic}</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <span className="text-3xl">🎓</span>
          </div>
          <h3 className="text-xl font-bold font-display mb-2">Test Your Knowledge</h3>
          <p className="text-indigo-100 text-sm mb-6 max-w-sm mx-auto">
            Ready to check if you've mastered <strong>{topic}</strong>? 
            Ask the AI to generate a custom 3-question mini-quiz instantly.
          </p>
          <Button 
            onClick={handleStartQuiz} 
            className="bg-white text-indigo-700 hover:bg-indigo-50 border-none shadow-lg"
          >
            Start AI Quiz
          </Button>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center animate-fadeIn">
        <div className="text-4xl mb-4">{score === 3 ? '🏆' : score >= 1 ? '👏' : '📚'}</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">Quiz Complete!</h3>
        <p className="text-slate-600 mb-6">
          You scored <strong className="text-indigo-600">{score} / {quizData.questions.length}</strong>
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleStartQuiz} variant="outline">Try New Questions</Button>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-slideUp">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} / {quizData.questions.length}</span>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Score: {score}</span>
      </div>

      <div className="p-6 md:p-8">
        <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-6 leading-relaxed">
          {question.question}
        </h4>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;
            const showStatus = selectedOption !== null;

            let btnClass = "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700";
            
            if (showStatus) {
              if (isSelected && isCorrectOption) btnClass = "bg-green-100 border-green-300 text-green-800 ring-1 ring-green-300";
              else if (isSelected && !isCorrectOption) btnClass = "bg-red-100 border-red-300 text-red-800 ring-1 ring-red-300";
              else if (!isSelected && isCorrectOption) btnClass = "bg-green-50 border-green-200 text-green-700"; // Show correct answer
              else btnClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-50";
            } else if (isSelected) {
               btnClass = "bg-indigo-50 border-indigo-300 text-indigo-700 ring-1 ring-indigo-200";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showStatus}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 font-medium ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                    showStatus && isCorrectOption ? 'bg-green-500 border-green-500 text-white' :
                    showStatus && isSelected && !isCorrectOption ? 'bg-red-500 border-red-500 text-white' :
                    'bg-white border-slate-300 text-slate-500'
                  }`}>
                    {['A','B','C','D'][idx]}
                  </span>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {selectedOption !== null && (
          <div className="mt-6 animate-fadeIn">
            <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
              <div className="flex items-start gap-3">
                <div className={`text-xl ${isCorrect ? 'text-green-600' : 'text-amber-600'}`}>
                  {isCorrect ? '✓' : '💡'}
                </div>
                <div>
                  <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite right.'}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Button onClick={handleNext}>
                {currentQuestionIndex + 1 === quizData.questions.length ? 'See Results' : 'Next Question →'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

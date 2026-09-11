import { useState, useCallback } from 'react'
import type { Question } from '../data/questions'
import { playCorrect, playWrong } from '../lib/sounds'

type FeedbackState = 'idle' | 'correct' | 'wrong'

interface ArcadeButtonProps {
  option: string
  index: number
  feedback: FeedbackState
  selectedAnswer: string | null
  correctAnswer: string
  onClick: (option: string) => void
}

const LETTER = ['A', 'B', 'C', 'D']

export function ArcadeButton({
  option,
  index,
  feedback,
  selectedAnswer,
  correctAnswer,
  onClick,
}: ArcadeButtonProps) {
  const isSelected = selectedAnswer === option
  const isCorrect  = option === correctAnswer
  const locked     = feedback !== 'idle'

  let stateClass = ''
  if (locked) {
    if (isCorrect)                        stateClass = 'correct'
    else if (isSelected && !isCorrect)    stateClass = 'wrong'
    else                                  stateClass = 'dimmed'
  }

  return (
    <button
      className={`arcade-btn panel-bevel-sm ${stateClass}`}
      disabled={locked}
      onClick={() => onClick(option)}
    >
      <span className="mr-3 opacity-60 text-xs">[{LETTER[index]}]</span>
      {option}
    </button>
  )
}

/* ────────────────────────────────────────────────── */

interface QuizCardProps {
  question: Question
  questionNumber: number
  total: number
  streak: number
  highScore: number
  onAnswer: (correct: boolean) => void
}

export function QuizCard({
  question,
  questionNumber,
  total,
  streak,
  highScore,
  onAnswer,
}: QuizCardProps) {
  const [feedback, setFeedback]             = useState<FeedbackState>('idle')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const handleClick = useCallback(
    (option: string) => {
      if (feedback !== 'idle') return

      const isCorrect = option === question.answer
      setSelectedAnswer(option)
      setFeedback(isCorrect ? 'correct' : 'wrong')

      if (isCorrect) playCorrect()
      else           playWrong()

      setTimeout(() => {
        setFeedback('idle')
        setSelectedAnswer(null)
        onAnswer(isCorrect)
      }, 600)
    },
    [feedback, question.answer, onAnswer]
  )

  const progress = ((questionNumber - 1) / total) * 100

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Stat Bar ── */}
      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-subtext tracking-widest uppercase font-mono mb-0.5">Racha</span>
          <span className={`stat-value text-lg ${streak === 0 && feedback === 'wrong' ? 'red' : ''}`}>
            {String(streak).padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-subtext tracking-widest mb-0.5 font-mono uppercase">
            {String(questionNumber).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="progress-bar-track w-28">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-subtext tracking-widest uppercase font-mono mb-0.5">Récord</span>
          <span className="stat-value text-lg">{String(highScore).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ── Question Panel ── */}
      <div
        className={`
          panel-bevel bg-surface border-2 p-5
          ${feedback === 'correct' ? 'border-cyan' : feedback === 'wrong' ? 'border-red' : 'border-border'}
          transition-colors duration-150
        `}
        style={
          feedback === 'correct'
            ? { boxShadow: '0 0 20px #00ffcc44' }
            : feedback === 'wrong'
            ? { boxShadow: '0 0 20px #ff005544' }
            : {}
        }
      >
        {/* Category tag */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[9px] tracking-[0.3em] text-subtext uppercase font-mono">
            ▸ {question.moduleId.toUpperCase()}
          </span>
          <span className="text-[9px] tracking-widest text-subtext font-mono opacity-50">
            MÓDULO-{String(questionNumber).padStart(3, '0')}
          </span>
        </div>

        {/* Question text */}
        <p className="font-arcade text-sm leading-relaxed text-text">
          {question.prompt}
        </p>
      </div>

      {/* ── Answer Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, i) => (
          <ArcadeButton
            key={option}
            option={option}
            index={i}
            feedback={feedback}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.answer}
            onClick={handleClick}
          />
        ))}
      </div>

      {/* ── Feedback flash ── */}
      <div className="h-6 flex items-center justify-center">
        {feedback === 'correct' && (
          <span className="text-cyan font-mono text-xs tracking-widest animate-pulse">
            ▶ CORRECTO  +1 COMBO
          </span>
        )}
        {feedback === 'wrong' && (
          <span className="text-red font-mono text-xs tracking-widest animate-pulse">
            ✕ FALLO — RACHA ROTA
          </span>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import { BookOpen, Plus, CheckCircle2, Sliders, Layers } from 'lucide-react';
import { AssessmentItem, ExamQuestion, QuestionType } from '../types/exams.types';
import { examService } from '../services/examService';

interface AuthoringStudioProps {
  assessments: AssessmentItem[];
  onAssessmentCreated?: (assessment: AssessmentItem) => void;
}

export const AuthoringStudio: React.FC<AuthoringStudioProps> = ({
  assessments,
  onAssessmentCreated
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);

  const [questionType, setQuestionType] = useState<QuestionType>('MCQ');
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [questionMarks, setQuestionMarks] = useState('');
  const [bloomLevel, setBloomLevel] =
    useState<ExamQuestion['bloomLevel']>('REMEMBER');

  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const resetForm = () => {
    setTitle('');
    setCourseCode('');
    setDurationMinutes('');
    setTotalMarks('');
    setScheduledDate('');
    setQuestions([]);
    setQuestionType('MCQ');
    setQuestionPrompt('');
    setQuestionMarks('');
    setBloomLevel('REMEMBER');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };

  const addQuestion = () => {
    if (!questionPrompt.trim()) {
      alert('Please enter the question.');
      return;
    }

    if (!questionMarks || Number(questionMarks) <= 0) {
      alert('Please enter valid marks for the question.');
      return;
    }

    if (questionType === 'MCQ') {
      const validOptions = options.filter((option) => option.trim() !== '');

      if (validOptions.length < 2) {
        alert('Please enter at least two options.');
        return;
      }

      if (!correctAnswer.trim()) {
        alert('Please enter the correct answer.');
        return;
      }
    }

    const newQuestion: ExamQuestion = {
      id: `question_${Date.now()}`,
      type: questionType,
      prompt: questionPrompt,
      marks: Number(questionMarks),
      bloomLevel,
      ...(questionType === 'MCQ'
        ? {
            options: options.filter((option) => option.trim() !== ''),
            correctAnswer
          }
        : {})
    };

    setQuestions((currentQuestions) => [
      ...currentQuestions,
      newQuestion
    ]);

    setQuestionPrompt('');
    setQuestionMarks('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };

  const saveExamPaper = async () => {
    if (!title.trim()) {
      alert('Please enter the exam title.');
      return;
    }

    if (!courseCode.trim()) {
      alert('Please enter the course code.');
      return;
    }

    if (!durationMinutes || Number(durationMinutes) <= 0) {
      alert('Please enter a valid exam duration.');
      return;
    }

    if (!totalMarks || Number(totalMarks) <= 0) {
      alert('Please enter the total marks.');
      return;
    }

    if (!scheduledDate) {
      alert('Please select the exam date.');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    const newExam: AssessmentItem = {
      id: `exam_${Date.now()}`,
      title,
      courseCode,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      scheduledDate,
      status: 'SCHEDULED',
      isLockedDueToAttendanceShortage: false,
      questions
    };

    const createdExam = await examService.createAssessment(newExam);

    if (onAssessmentCreated) {
      onAssessmentCreated(createdExam);
    }

    alert(`Exam paper created: ${createdExam.title}`);

    resetForm();
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-cu-navy flex items-center gap-2">
              <BookOpen size={18} />
              Create New Exam Paper
            </h3>
            <p className="text-xs text-gray-500">
              Create the examination paper and add questions.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsCreating(false);
            }}
            className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-xl border border-cu-border p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Layers size={18} />
            <h4 className="font-bold text-base text-cu-navy">
              Examination Details
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Exam Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter exam title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cu-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="Enter course code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cu-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="Enter duration"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cu-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Total Marks
              </label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                placeholder="Enter total marks"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cu-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Exam Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-cu-navy"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-cu-border p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Sliders size={18} />
            <h4 className="font-bold text-base text-cu-navy">
              Add Question
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) =>
                  setQuestionType(e.target.value as QuestionType)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="MCQ">MCQ</option>
                <option value="MULTI_SELECT">Multiple Select</option>
                <option value="FORMULA_LATEX">Formula / LaTeX</option>
                <option value="SUBJECTIVE_ESSAY">Subjective Essay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Marks
              </label>
              <input
                type="number"
                value={questionMarks}
                onChange={(e) => setQuestionMarks(e.target.value)}
                placeholder="Question marks"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Bloom Level
              </label>
              <select
                value={bloomLevel}
                onChange={(e) =>
                  setBloomLevel(
                    e.target.value as ExamQuestion['bloomLevel']
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="REMEMBER">Remember</option>
                <option value="UNDERSTAND">Understand</option>
                <option value="APPLY">Apply</option>
                <option value="ANALYZE">Analyze</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Question
            </label>
            <textarea
              value={questionPrompt}
              onChange={(e) => setQuestionPrompt(e.target.value)}
              placeholder="Enter your question"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none resize-none"
            />
          </div>

          {questionType === 'MCQ' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-600">
                Options
              </label>

              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...options];
                    updatedOptions[index] = e.target.value;
                    setOptions(updatedOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                />
              ))}

              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter correct answer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>
          )}

          <button
            onClick={addQuestion}
            className="inline-flex items-center gap-1.5 bg-[#002561] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow hover:bg-[#0E1B38] transition"
          >
            <Plus size={14} />
            Add Question
          </button>
        </div>

        {questions.length > 0 && (
          <div className="bg-white rounded-xl border border-cu-border p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-base text-cu-navy">
              Questions Added ({questions.length})
            </h4>

            {questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-100 rounded-lg p-3"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-cu-navy">
                      Q{index + 1}. {question.prompt}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {question.type} • {question.marks} Marks •{' '}
                      {question.bloomLevel}
                    </p>
                  </div>

                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={saveExamPaper}
            className="inline-flex items-center gap-1.5 bg-[#002561] text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow hover:bg-[#0E1B38] transition"
          >
            <CheckCircle2 size={14} />
            Save Exam Paper
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-base font-bold text-cu-navy flex items-center gap-2">
            <BookOpen size={18} />
            Assessment Authoring &amp; Examination Schedule
          </h3>
          <p className="text-xs text-gray-500">
            Author randomized question banks, Bloom taxonomy tags, and KaTeX math formulas.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="inline-flex items-center gap-1.5 bg-[#002561] text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow hover:bg-[#0E1B38] transition"
        >
          <Plus size={14} />
          Create New Exam Paper
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-cu-border p-5 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-cu-saffron uppercase">
                {a.status === 'SCHEDULED'
                  ? 'Upcoming Examination'
                  : 'Past Assessment'}
              </span>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  a.status === 'SCHEDULED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {a.status}
              </span>
            </div>

            <h4 className="font-bold text-base text-cu-navy">
              {a.title}
            </h4>

            <p className="text-xs text-gray-600">
              Bloom taxonomy calibrated questions with randomized shuffler and anti-cheat web locks.
            </p>

            <div className="pt-2 text-xs text-gray-500 flex justify-between border-t border-gray-100">
              <span>Duration: {a.durationMinutes} Mins</span>
              <span>Total Marks: {a.totalMarks}</span>
              <span>Date: {a.scheduledDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
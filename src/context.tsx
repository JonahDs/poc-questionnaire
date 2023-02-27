import React from "react";

export type Question =
  | {
      question: string;
      type: "radio" | "multiple";
      options: string[];
    }
  | {
      question: string;
      type: "boolean";
    };

type InjectedQuestion = Question & { completed: boolean };

export interface Answer {
  question: string;
  answers: string[];
}

interface PublicQuestionnaireContext {
  submit: (data: Answer) => void;
  question?: Question;
  answers: Answer[];
}

interface PrivateQuestionnaireContext {
  setQuestions: (data: Question[]) => void;
  questions?: InjectedQuestion[];
}

type QuestionnaireContext = PublicQuestionnaireContext &
  PrivateQuestionnaireContext;

const Questionnaire = React.createContext<QuestionnaireContext>({
  submit: () => {
    throw new Error("Failed");
  },
  setQuestions: () => {
    throw new Error("Failed");
  },
  answers: [],
});

export const QuestionnaireProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [questions, setQuestions] = React.useState<
    InjectedQuestion[] | undefined
  >();
  const [answers, setAnswers] = React.useState<Answer[]>([]);

  const question = React.useMemo<InjectedQuestion | undefined>(() => {
    if (questions === undefined) return;

    const targetQuestion = questions.find((question) => !question.completed);

    if (targetQuestion == null) {
      console.log("completed");
      return;
    }

    return targetQuestion;
  }, [questions]);

  const handleSubmit = React.useCallback(
    (answer: Answer) => {
      if (question === undefined) {
        console.log("answered an unknown question");
        return;
      }

      if (
        (question.type === "multiple" || question.type === "radio") &&
        !answer.answers.every((entry) =>
          question.options.find((t) => t === entry)
        )
      ) {
        console.log("invalid entry");
        return;
      }

      setAnswers((current) => [...current, answer]);

      setQuestions((current) => {
        if (current === undefined) return;
        const target = current.findIndex((t) => t.question === answer.question);

        if (target === -1) {
          console.log("failed next");
          return current;
        }

        const savedItem = { ...current[target] };
        const remainders = current.filter((t, i) => i !== target);

        return [
          ...remainders,
          {
            ...savedItem,
            completed: true,
          },
        ];
      });
    },
    [question]
  );

  const preProcessQuestions = React.useCallback((data: Question[]) => {
    setQuestions(
      data.map<InjectedQuestion>((data) => ({
        ...data,
        completed: false,
      }))
    );
  }, []);

  const value = React.useMemo<QuestionnaireContext>(
    () => ({
      submit: handleSubmit,
      setQuestions: preProcessQuestions,
      question,
      answers,
    }),
    [preProcessQuestions, question, answers, handleSubmit]
  );

  return (
    <Questionnaire.Provider value={value}>{children}</Questionnaire.Provider>
  );
};

export const useQuestionnaire = (
  questions: Question[]
): PublicQuestionnaireContext => {
  const context = React.useContext(Questionnaire);

  React.useEffect(() => {
    if (context.questions === undefined || !context.questions.length) {
      context.setQuestions(questions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    submit: context.submit,
    question: context.question,
    answers: context.answers,
  };
};

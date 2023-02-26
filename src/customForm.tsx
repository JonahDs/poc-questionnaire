import React from "react";

import type { Answer, Question } from "./context";
import type { ChangeEvent } from "react";

type CustomFormProps = {
  question: Question;
  handleSubmit: (data: Answer) => void;
};

const CustomForm = ({
  question,
  handleSubmit,
}: CustomFormProps): JSX.Element => {
  const [answers, setAnswers] = React.useState<string[] | undefined>();

  const handleChange = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAnswers((current) => {
        if (current === undefined) return [event.target.value];

        const removableIndex = current.indexOf(event.target.value);

        return [
          ...current.filter((_x, i) => i !== removableIndex),
          event.target.value,
        ];
      });
    },
    []
  );

  const render = React.useMemo(() => {
    if (question.type === "boolean") {
      return (
        <>
          <p>Yes</p>
          <input
            onChange={handleChange}
            type="radio"
            value="yes"
            name="single"
          />
          <p>No</p>
          <input
            onChange={handleChange}
            type="radio"
            value="no"
            name="single"
          />
        </>
      );
    }

    return (
      <>
        {question.options.map((option) => (
          <div key={option} style={{ display: "flex" }}>
            <input
              type="radio"
              name={question.type === "multiple" ? option : "single"}
              value={option}
              onChange={handleChange}
            />
            <p>{option}</p>
          </div>
        ))}
      </>
    );
  }, [handleChange, question]);

  const customSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (answers === undefined) return;
      handleSubmit({
        question: question.question,
        answers,
      });
      setAnswers(undefined);
    },
    [answers, handleSubmit, question.question]
  );

  return (
    <form onSubmit={customSubmit}>
      <p>{question.question}</p>
      {render}
      <button type="submit">Next</button>
    </form>
  );
};

export default CustomForm;

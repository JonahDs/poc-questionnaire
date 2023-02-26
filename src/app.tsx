import React from "react";

import { useQuestionnaire } from "./context";
import CustomForm from "./customForm";

import type { Question } from "./context";

const questionnaire: Question[] = [
  {
    question: "How often do you sport? (can only select one)",
    type: "radio",
    options: ["never", "2 times a week", "3 times a week", "more"],
  },
  {
    question: "Do you drink alcohol",
    type: "boolean",
  },
  {
    question: "Pick your weekly activities (can select multiple)",
    type: "multiple",
    options: ["games", "movies", "sports", "drinking", "sleeping"],
  },
];

const App = () => {
  const { submit, question, answers } = useQuestionnaire(questionnaire);

  return (
    <>
      {question !== undefined && (
        <CustomForm handleSubmit={submit} question={question} />
      )}
      {question === undefined && (
        <>
          <p>Completed</p>
          <div>
            {answers.map((t) => (
              <React.Fragment key={`${t.question + t.answers}`}>
                <p key={t.question}>
                  {"---"}
                  {t.question}
                </p>
                {t.answers.map((x) => (
                  <p key={x}>
                    {">>>"}
                    {x}
                  </p>
                ))}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default App;

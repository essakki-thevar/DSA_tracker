import { Problem, Difficulty } from "@/lib/types";
import { part1Data } from "./dsaSheetPart1";
import { part2Data } from "./dsaSheetPart2";
import { part3Data } from "./dsaSheetPart3";
import { part4Data } from "./dsaSheetPart4";
import { part5Data } from "./dsaSheetPart5";

const rawData = [
  ...part1Data,
  ...part2Data,
  ...part3Data,
  ...part4Data,
  ...part5Data
];

export const striverProblems: Problem[] = rawData.map((item, index) => ({
  id: `prob-${index + 1}`,
  topic: item[0],
  title: item[1],
  url: item[2] === "<->" ? "#" : item[2],
  difficulty: "Medium" as Difficulty,
}));

export const groupedProblems = striverProblems.reduce((acc, problem) => {
  if (!acc[problem.topic]) {
    acc[problem.topic] = [];
  }
  acc[problem.topic].push(problem);
  return acc;
}, {} as Record<string, Problem[]>);

export const topicsList = Object.keys(groupedProblems);

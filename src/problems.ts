import fs from "fs";
import path from "path";

export const postProblem = async () => {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query questionOfToday {
            activeDailyCodingChallengeQuestion {
              date
              userStatus
              link
              question {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                titleSlug
                hasVideoSolution
                hasSolution
                topicTags {
                  name
                  id
                  slug
                }
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    const problemOfTheDay = data.data.activeDailyCodingChallengeQuestion;
    const problem = problemOfTheDay.question;

    const problemTitle = problem.title;
    const problemLink = problemOfTheDay.link;
    const problemTags = problem.topicTags.map(
      (tag: { name: string }) => tag.name
    );

    type ret = {
      title: string;
      link: string;
      difficulty: string;
      tags: string[];
    };
    const res: ret = {
      title: problemTitle,
      link: `https://leetcode.com${problemLink}`,
      difficulty: problem.difficulty,
      tags: problemTags,
    };

    return res;
  } catch (error) {
    console.error("Error fetching problem:", error);
    return undefined;
  }
};

const __readFile = () => {
  const filePath = path.join(process.cwd(), "/public/posts.json");
  return {
    slugs: JSON.parse(fs.readFileSync(filePath, "utf8")),
    filePath,
  };
};

const _appendSlug = (slug, dsaTopic) => {
  const { slugs, filePath } = __readFile();
  slugs[dsaTopic].push(slug);
  fs.writeFileSync(filePath, JSON.stringify(slugs));
};

const _generateRandomQuestion = (problemsetQuestionList) => {
  return problemsetQuestionList.questions[
    Math.floor(Math.random() * (problemsetQuestionList.total - 1))
  ];
};

const _isNotAcceptedQuestion = (questionSlug, dsaTopic) => {
  const { slugs } = __readFile();

  return slugs[dsaTopic].includes(questionSlug);
};

export const customProblem = async (dsaTopic) => {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
              total: totalNum
              questions: data {
                categoryTitle
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                titleSlug
                topicTags {
                  name
                  id
                  slug
                }
                hasSolution
                hasVideoSolution
              }
            }
          }
        `,
        variables: {
          categorySlug: "",
          skip: 0,
          limit: 50,
          filters: {
            tags: [dsaTopic],
            difficulty: "EASY",
          },
        },
      }),
    });

    const {
      data: { problemsetQuestionList },
    } = await response.json();

    let randQuestion = _generateRandomQuestion(problemsetQuestionList);

    const { slugs } = __readFile();

    if (problemsetQuestionList.total <= slugs[dsaTopic].length) {
      return undefined;
    }

    while (_isNotAcceptedQuestion(randQuestion.titleSlug, dsaTopic)) {
      randQuestion = _generateRandomQuestion(problemsetQuestionList);
    }

    _appendSlug(randQuestion.titleSlug, dsaTopic);

    return {
      title: randQuestion.title,
      link: `https://leetcode.com/problems/${randQuestion.titleSlug}`,
      difficulty: randQuestion.difficulty,
      tags: randQuestion.topicTags,
    };
  } catch (error) {
    console.error("Error fetching problem:", error);
    return undefined;
  }
};

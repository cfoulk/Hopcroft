import fs from "fs";
import path from "path";

const DSA_DIFFICULTY = "MEDIUM";

const __readFile = () => {
  const filePath = path.join(process.cwd(), "/public/posts.json");
  return {
    slugs: JSON.parse(fs.readFileSync(filePath, "utf8")),
    filePath,
  };
};

const _appendSlug = (slug, dsaTopic) => {
  const { slugs, filePath } = __readFile();
  slugs[dsaTopic][DSA_DIFFICULTY].push(slug);
  fs.writeFileSync(filePath, JSON.stringify(slugs));
};

const _generateRandomQuestion = (problemsetQuestionList) => {
  return problemsetQuestionList.questions[
    Math.floor(Math.random() * (problemsetQuestionList.total - 1))
  ];
};

const _isNotAcceptedQuestion = (questionSlug, dsaTopic) => {
  const { slugs } = __readFile();

  return slugs[dsaTopic][DSA_DIFFICULTY].includes(questionSlug);
};

export const customProblem = async (dsaTopic) => {
  try {
    console.log("creating problem...");
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
                difficulty
                paidOnly: isPaidOnly
                title
                titleSlug
                topicTags {
                  name
                  id
                  slug
                }
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
            difficulty: DSA_DIFFICULTY,
          },
        },
      }),
    });

    const {
      data: { problemsetQuestionList },
    } = await response.json();

    let randQuestion = _generateRandomQuestion(problemsetQuestionList);

    const { slugs } = __readFile();

    if (
      problemsetQuestionList.total <= slugs[dsaTopic][DSA_DIFFICULTY].length
    ) {
      console.error("No more questions. Increase limit.");
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
      tags: randQuestion.topicTags.map((item) => item.name),
    };
  } catch (error) {
    console.error("Error fetching problem:", error);
    return undefined;
  }
};

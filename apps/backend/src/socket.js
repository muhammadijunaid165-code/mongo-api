import Interview from "./models/Interview.js";

export function registerInterviewSocket(io, socket) {
  let timerId = null;
  let remaining = 60;
  let currentIndex = 0;
  let interviewId = null;

  socket.on("interview:join", async ({ id }) => {
    interviewId = id;
    const interview = await Interview.findById(id);
    if (!interview) return socket.emit("error", { message: "Interview not found" });
    currentIndex = 0;
    remaining = 60;
    tick();
  });

  socket.on("interview:answer", async ({ answer, timeTakenSec }) => {
    const interview = await Interview.findById(interviewId);
    if (!interview) return;
    const question = interview.questions[currentIndex];
    interview.qa.push({ question, answer, timeTakenSec });
    await interview.save();
    nextQuestion();
  });

  socket.on("disconnect", () => clearInterval(timerId));

  function tick() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      remaining -= 1;
      io.to(socket.id).emit("timer", { remaining, index: currentIndex });
      if (remaining <= 0) {
        nextQuestion(true);
      }
    }, 1000);
  }

  async function nextQuestion(auto = false) {
    clearInterval(timerId);
    const interview = await Interview.findById(interviewId);
    if (!interview) return;

    if (auto) {
      const question = interview.questions[currentIndex];
      interview.qa.push({ question, answer: "", timeTakenSec: 60 });
      await interview.save();
    }

    currentIndex += 1;
    if (currentIndex >= interview.questions.length) {
      io.to(socket.id).emit("interview:complete");
      return;
    }
    remaining = 60;
    tick();
    io.to(socket.id).emit("interview:next", { index: currentIndex });
  }
}

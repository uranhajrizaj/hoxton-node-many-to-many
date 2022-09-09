import express from "express";
import Database from "better-sqlite3";
import cors from "cors";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();

app.use(cors());
app.use(express.json());

const port = 3333;

const getApplicantsForInterviewer = db.prepare(`
SELECT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = @interviewerId;
`);

const getInterviewerForApplicants = db.prepare(`
SELECT  interviewers.* FROM  interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.applicantId = @applicantId;
`);

const interviewers = db.prepare(`
 SELECT * FROM interviewers 
`);

const interviewer = db.prepare(`
 SELECT * FROM interviewers WHERE id=@id
`);

const applicants = db.prepare(`
 SELECT * FROM applicants 
`);

const applicant = db.prepare(`
 SELECT * FROM applicants WHERE id=@id
`);
app.get("/applicants", (req, res) => {
  const allApplicants = applicants.all();
  for (let applicant of allApplicants) {
    const applicantInterviewer = getInterviewerForApplicants.all({
      applicantId: applicant.id,
    });
    applicant.interviewer = applicantInterviewer;
  }
  res.send(allApplicants);
});

app.get("/applicants/:id", (req, res) => {
  const singleApplicant = applicant.get(req.params);
  if (singleApplicant) {
    const applicantInterviewer = getInterviewerForApplicants.all({
      applicantId: req.params.id,
    });
    singleApplicant.interviewer = applicantInterviewer;
    res.send(singleApplicant);
  } else res.status(404).send({ error: "Applicant not found" });
});

app.get("/interviewers", (req, res) => {
  const allInterviewers = interviewers.all();
  for (let interviewer of allInterviewers) {
    const interviewerApplicants = getApplicantsForInterviewer.all({
      interviewerId: interviewer.id,
    });
    interviewer.applicants = interviewerApplicants;
  }
  res.send(allInterviewers);
});

app.get("/interviewers/:id", (req, res) => {
  const singleInterviewer = interviewer.get(req.params);
  if (singleInterviewer) {
    const interviewerApplicants = getApplicantsForInterviewer.all({
      interviewerId: req.params.id,
    });
    singleInterviewer.applicants = interviewerApplicants;
    res.send(singleInterviewer);
  } else res.status(404).send({ error: "Interviewer not found" });
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}/applicants`);
});

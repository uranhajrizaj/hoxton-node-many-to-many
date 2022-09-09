import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });

const applicants = [
  {
    name: "Luke Ryan",
    email: "luke@gmail.com",
  },
  {
    name: "Abdul Ryan",
    email: "abdul@gmail.com",
  },
  {
    name: "Eric Phillips",
    email: "eric@gmail.com",
  },
  {
    name: "Marco Phillips",
    email: "marco@gmail.com",
  },
  {
    name: "Oskar Phillips",
    email: "oskar@gmail.com",
  },
];

const interviewers = [
  {
    name: "Thomas Black",
    email: "thomas@gmail.com",
  },
  {
    name: "Bryan Powell",
    email: "brayan@gmail.com",
  },
  {
    name: "Saif Powell",
    email: "saif@gmail.com",
  },
];

const interviews = [
  {
    applicantId: 1,
    interviewerId: 1,
  },
  {
    applicantId: 3,
    interviewerId: 1,
  },
  {
    applicantId: 2,
    interviewerId: 2,
  },
  {
    applicantId: 4,
    interviewerId: 2,
  },
  {
    applicantId: 5,
    interviewerId: 3,
  },
];

const dropApplicantsTable = db.prepare(`
DROP TABLE IF EXISTS applicants;
`);
dropApplicantsTable.run();

const createTableApplicants = db.prepare(`
CREATE TABLE IF NOT EXISTS applicants (
    id INTEGER,
    name TEXT NOT NULl,
    email TEXT NOT NULL,
    PRIMARY KEY(id)
);
`);
createTableApplicants.run();

const createApplicant = db.prepare(`
INSERT INTO applicants (name,email) VALUES (@name,@email)
`);

for (let applicant of applicants) createApplicant.run(applicant);

const dropInterviewersTable = db.prepare(`
DROP TABLE IF EXISTS interviewers;
`);
dropInterviewersTable.run();

const createTableInterviewers = db.prepare(`
CREATE TABLE IF NOT EXISTS  interviewers (
    id INTEGER,
    name TEXT NOT NULl,
    email TEXT NOT NULL,
    PRIMARY KEY(id)
);
`);
createTableInterviewers.run();

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name,email) VALUES (@name,@email)
`);

for (let interviewer of interviewers) createInterviewer.run(interviewer);

const dropInterviewsTable = db.prepare(`
DROP TABLE IF EXISTS interviews;
`);
dropInterviewsTable.run();

const createTableInterviews = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews(
     id INTEGER,
    interviewerId INTEGER,
    applicantId INTEGER,
    FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewerId) REFERENCES interviewers(id)ON DELETE CASCADE,
    PRIMARY KEY(id)
);
`);
createTableInterviews.run();

const createInterview = db.prepare(`
INSERT INTO interviews (interviewerId,applicantId) VALUES (@interviewerId,@applicantId)
`);

for (let interview of interviews) createInterview.run(interview);

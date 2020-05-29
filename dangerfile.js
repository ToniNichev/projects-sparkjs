import { fail, warn, message, markdown, danger } from "danger"

fail("Testing failure message");
warn("Testing warning");
message("Normal message");
markdown("*Markdown* is also **supported**");

const { additions = 0, deletions = 0 } = danger.github.pr;
message(`:tada: The PR added ${additions} and removed ${deletions} lines.`);

const modifiedMD = danger.git.modified_files.join("\n");
message(`Changed Files in this PR: \n ${modifiedMD} \n`);
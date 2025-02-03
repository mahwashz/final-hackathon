import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "wwnt1s9e",
  dataset: "production",
  apiVersion: "2021-08-31",
  useCdn: false,
  token:
   "skP3bN88jhZ14AStyR7fJ9X7WbwX8SjMBrnU1VtrOC4Jhace46ksDdYzlebScS3HHBkpWgWyX4WfpzCmEV4QQgtYPevfzJFJoaahWiA8NeEYL3WtFcXKhonbNO8T0UivfTA3fQPqWtQgWRT7FFJe7LPwzcu2Xbjks18GenwWkCjmtnOo7Rqv",
});

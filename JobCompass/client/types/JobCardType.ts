type JobCard = {
  // create type alias
  title: String;
  company: String;
  type: String;
  salary_range: String;
  created_at: Number;
  skills: String[];
  description: String;
  requirements: String;
};

export default JobCard;

// use : for type annotation on vars, parameters, return types
// use <> for generic types like states and promises

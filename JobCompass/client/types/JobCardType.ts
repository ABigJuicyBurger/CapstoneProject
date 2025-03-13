type JobCard = {
  // create type alias
  title: string;
  company: string;
  type: string;
  salary_range: string;
  created_at: number;
  skills: string[];
  description: string;
  requirements: string;
  id: string;
  latitude: string;
  longitude: string;
};

export default JobCard;

// use : for type annotation on vars, parameters, return types
// use <> for generic types like states and promises

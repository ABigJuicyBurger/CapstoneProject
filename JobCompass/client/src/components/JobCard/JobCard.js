"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var axios_1 = require("axios");
require("./JobCard.scss");
var backendURL = import.meta.env.VITE_BACKEND_URL;
console.log(backendURL);
function JobCard() {
    var _this = this;
    var _a = (0, react_1.useState)(null), job = _a[0], setJob = _a[1];
    var _b = (0, react_1.useState)(false), expandedText = _b[0], setExpandedText = _b[1];
    var MAX_LENGTH = 150;
    //   const {id} = useParams()
    var fetchJob = function () { return __awaiter(_this, void 0, void 0, function () {
        var jobResponse, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Attempting to fetch from:", "".concat(backendURL, "/jobs/1"));
                    return [4 /*yield*/, axios_1.default.get("".concat(backendURL, "/jobs/20"))];
                case 1:
                    jobResponse = _a.sent();
                    setJob(jobResponse.data);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    setJob(null);
                    console.log(err_1.message);
                    return [2 /*return*/, <h1>Could not fetch job!</h1>];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchJob();
    }, []);
    // TODO: reload automatically on new job (if user types different id)
    // useEffect(() => {
    //   fetchJob();
    // }, [id]);
    // TODO: style to save job appropriately and have it link to user faves
    var saveJob = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, <h1>Job saved</h1>];
        });
    }); };
    console.log(job);
    if (!job) {
        return <h1>Loading Job...</h1>;
    }
    return (<div className="jobCard">
      <div className="jobCard__header">
        <h2 className="jobCard__header__title">{job.title}</h2>
        <section className="jobCard__header__title__company">
          <h3 className="jobCard__header__company">{job.company}</h3>
          <img src="" className="jobCard__header__logo-placeholder" alt="logo"/>
        </section>
        <div className="jobCard__header__cta">
          {/* <Link to="/jobURL">Apply</Link> */}
          <button onClick={saveJob}> Save job </button>
        </div>
      </div>
      <div className="jobCard__details">
        <h2 className="jobCard__details__heading">Job Details</h2>
        <div className="jobCard__details__type">
          <section className="jobCard__details__type__section">
            <h3 className="jobCard__details__type-title">Job Type</h3>
            <p className="jobCard__details__type-text">{job.type}</p>
          </section>
          <section className="jobCard__details__salary__section">
            <h3 className="jobCard__details__salary-title">Salary</h3>
            <p className="jobCard__details__salary-text">{job.salary_range}</p>
          </section>
          <section className="jobCard__details__date__section">
            <h4 className="jobCard__details__date-title">Date</h4>
            <p className="jobCard__details__date-text">
              {(0, date_fns_1.format)(new Date(job.created_at), "MMMM d, yyyy")}
            </p>
          </section>
        </div>
      </div>
      <div className="jobCard__skills">
        <h3 className="jobCard__skills__title">Skills</h3>
        <div className="jobCard__skills__list">
          <ul className="jobCard__skills__items">
            {job.skills.map(function (skill, index) { return (<li className="jobCard__skills__item" key={index}>
                {skill}
              </li>); })}
          </ul>
        </div>
      </div>
      <div className="jobCard__description">
        <h3 className="jobCard__description__title">Job Description</h3>
        <p className="jobCard__description__text">
          {expandedText
            ? job.description
            : "".concat(job.description.substring(0, MAX_LENGTH), "...")}
        </p>
        <button className="jobCard__description__button" onClick={function () { return setExpandedText(!expandedText); }}>
          {expandedText ? "Show Less" : "Read More"}
        </button>
        <h3 className="jobCard__description__title">Requirements</h3>
        <p className="jobCard__description__requirements">{job.requirements}</p>
      </div>
    </div>);
}
exports.default = JobCard;

import React, { useEffect, useState } from "react";
import ApiManager from "../../api";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

function ListExam() {
  const [exams, setExams] = useState([]);
  const [sportNames, setSportNames] = useState({});
  const [studentNames, setStudentNames] = useState({});

  useEffect(() => {
    fetchExam();
  }, []);

  const fetchExam = () => {
    ApiManager.get("/Reservations/list")
      .then((res) => {
        setExams(res.data);
        res.data.forEach((exam) => {
          if (exam.sportId && !sportNames[exam.sportId]) {
            fetchSportName(exam.sportId);
          }
          if (exam.studentId && !studentNames[exam.studentId]) {
            fetchStudentName(exam.studentId);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchSportName = async (sportId) => {
    try {
      const response = await ApiManager.get(`/Sports/${sportId}`);
      setSportNames((prevSportNames) => ({
        ...prevSportNames,
        [sportId]: response.data.name,
      }));
    } catch (error) {
      console.error("Error fetching sport name:", error);
    }
  };

  const fetchStudentName = async (studentId) => {
    try {
      const response = await ApiManager.get(`/Students/student/${studentId}`);
      setStudentNames((prevStudentNames) => ({
        ...prevStudentNames,
        [studentId]: response.data.codeUIR,
      }));
    } catch (error) {
      console.error("Error fetching student name:", error);
    }
  };

  const handleDelete = async (examId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        await ApiManager.delete(`/Exam/${examId}`);
        fetchExam();
        toast.success("Salle supprimée avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la suppression de la salle.");
      }
    }
  };

  return (
    <div className="rounded-sm border m-6 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white font-satoshi">
          List des Reservations
        </h4>
      </div>

      <div className="flex flex-col font-satoshi">
        <div className="grid grid-cols-2 rounded-sm bg-blue-100 dark:bg-meta-4 text-graydark sm:grid-cols-9"> 
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Student code</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Sport</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Time</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">List Student</h5>
          </div>
        </div>

        {exams.map((exam, key) => (
          <div
            className={`grid grid-cols-2 sm:grid-cols-9 ${
              key === exams.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
            }`}
            key={exam.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block font-semibold">
                {studentNames[exam.studentId] || "Loading..."}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block font-semibold">
                {sportNames[exam.sportId] || "Loading..."}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black">
                {exam.hourStart} - {exam.hourEnd}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              {exam.onlyDate}
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              {/* {exam.codeUIRList} */}
              {exam.codeUIRList ? exam.codeUIRList.join(" ") : "No codes"}
            </div>

            <div className="hidden items-center justify-center text-2xl p-2.5 sm:flex xl:p-5 gap-3">
              <Link to={`/update/${exam.id}`}>
                <FaRegEdit className="text-graydark cursor-pointer" />
              </Link>
              <MdDelete
                className="cursor-pointer text-red-500"
                onClick={() => handleDelete(exam.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListExam;

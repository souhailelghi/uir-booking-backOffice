import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import ApiManager from "../../api";
import { toast } from "react-toastify";

import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";


function UpdatePlanning() {
  const location = useLocation();
  const sportIds = location.state?.sportIds;

  console.log("names:", sportIds);
  const { id } = useParams(); // Get the test ID from the URL
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [formateurs, setFormateurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [unitsOfFormation, setUnitsOfFormation] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState("");

  //todo : "-----------------"
  const [planningId, setPlanningId] = useState("");
  const [day, setDay] = useState("");
  const [timeRanges, setTimeRanges] = useState([
    { hourStart: "", hourEnd: "" },
  ]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  //todo : "-----------------"

  //todo : ----------------

  useEffect(() => {
    const fetchPlanningById = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await ApiManager.get(`/Plannings/get-by-id/${id}` );
        const { day, timeRanges } = response.data;
        console.log("response.data", response.data.timeRanges);
        console.log("**response.data", response.data);

        setDay(day);
        setTimeRanges(timeRanges);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Error fetching planning: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlanningById();
    }
  }, [id]);

  const handleTimeRangeChange = (index, event) => {
    const { name, value } = event.target;
    setTimeRanges((prev) =>
      prev.map((range, i) =>
        i === index ? { ...range, [name]: value } : range
      )
    );
  };

  const handleAddTimeRange = () => {
    setTimeRanges([...timeRanges, { hourStart: "", hourEnd: "" }]);
  };

  const handleRemoveTimeRange = async (id, index) => {
    try {
      setTimeRanges(timeRanges.filter((_, i) => i !== index));
      const response = await ApiManager.delete(`/TimeRanges/delete/${id}` );
      console.log("id of time exact", id);
      console.log("index of time exact", index);
      console.log("res delete : ", response);
    } catch (err) {
      console.error("Error deleting test:", err);
    }
  };

  const handleUpdatePlanning = async (event) => {
    event.preventDefault();
    console.log("id sport : ", id);

    const planningData = {
      id: id,
      day: day,
      timeRanges,
    };

    try {
      const response = await ApiManager.put("/Plannings/update", planningData);

      if (response.status === 200) {
        Swal.fire({
          title: " Planning update avec succès!",
          icon: "success",
        });
        toast.success("Planning updated successfully!");
        setSuccessMessage("Planning updated successfully!");
        console.log("update .");
        navigate(`/planning-list?id=${sportIds}`);
      } else {
        toast.error("Failed to update test.");
      }

      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error updating planning: " + error.message);
      setSuccessMessage("");
    }
  };
  //todo : ----------------
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await ApiManager.get(`/Plannings/get-by-id/${id}`);
        console.log("get by id planning", id);

        const data = response.data;
        console.log(data.reservationDate);

        setValue("description", data.reservationDate);

        console.log("time for update ", data);
      } catch (error) {
        toast.error("Failed to load test data.");
        console.error("Error fetching test data:", error);
      }
    };

    if (id) {
      fetchTestData();
    }
  }, [id, setValue]);

  useEffect(() => {
    if (selectedFiliere) {
      const filiere = filieres.find((f) => f.id === selectedFiliere);
      if (filiere && filiere.filiereUnitOfFormations) {
        const units = filiere.filiereUnitOfFormations.map(
          (uf) => uf.unitOfFormation
        );
        setUnitsOfFormation(units);
      } else {
        setUnitsOfFormation([]);
      }
    }
  }, [selectedFiliere, filieres]);

  const handleCancel = () => {
    navigate(`/planning-list?id=${sportIds}`);
  };

  return (
    <div className="mt-6 gap-9 sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black text-3xl dark:text-white">
              Mettre à jour Time
            </h3>
          </div>
          <form onSubmit={handleUpdatePlanning}>
  <div className="p-6.5">
    <div>
      <div>
        <label>Day: {day}</label>
      </div>
      <h3>Time Ranges</h3>
      
      {timeRanges.map((range, index) => (
        <div key={index} className="flex items-center space-x-4 mb-4">
          <label className="flex justify-center rounded py-2 px-6 font-medium text-green hover:bg-opacity-90">
            Hour Start:
          </label>
          <input
            className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition"
            type="time"
            name="hourStart"
            value={range.hourStart}
            onChange={(e) => handleTimeRangeChange(index, e)}
            required
          />
          <label className="flex justify-center rounded py-2 px-6 font-medium text-green hover:bg-opacity-90">
            Hour End:
          </label>
          <input
            className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition"
            type="time"
            name="hourEnd"
            value={range.hourEnd}
            onChange={(e) => handleTimeRangeChange(index, e)}
            required
          />
          <button
            type="button"
            className="flex ml-auto justify-right rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
            onClick={() => handleRemoveTimeRange(range.id, index)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mb-6">
        <button
          type="button"
          className="flex justify-left rounded bg-primary py-2 px-10 font-medium text-white hover:bg-opacity-90"
          onClick={handleAddTimeRange}
        >
          Add Time Range
        </button>
      </div>

      {loading && <p>Loading current planning details...</p>}
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>

    {/* Cancel and Submit buttons */}
    <div className="flex justify-end gap-4.5 mt-6">
      <button
        type="button"
        className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white hover:bg-opacity-90"
        onClick={handleCancel}
      >
        Annuler
      </button>
      <button
        type="submit"
        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
      >
        Mettre à jour
      </button>
    </div>
  </div>
</form>

        </div>
      </div>
    </div>
  );
}

export default UpdatePlanning;

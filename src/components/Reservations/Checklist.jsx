import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiManager from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checklist = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [sportNames, setSportNames] = useState({});
  const [checkedBoxes, setCheckedBoxes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await ApiManager.get(`/Reservations/${id}`);
        setReservation(response.data);

        // Initialize the checkbox states
        const initialCheckedState = {};
        if (response.data.codeUIRList && response.data.codeUIRList.length > 0) {
          response.data.codeUIRList.forEach((_, index) => {
            initialCheckedState[index] = false;
          });
        }
        // Include the individual `codeUIR` checkbox state
        if (response.data.codeUIR) {
          initialCheckedState["singleCode"] = false;
        }
        setCheckedBoxes(initialCheckedState);

        if (response.data.sportId && !sportNames[response.data.sportId]) {
          fetchSportName(response.data.sportId);
        }
      } catch (error) {
        console.error("Error fetching reservation checklist:", error);
        toast.error("Failed to fetch reservation data.");
      }
    };

    if (id) {
      fetchReservation();
    }
  }, [id]);

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

  const handleCheckboxChange = (key) => {
    setCheckedBoxes((prevChecked) => ({
      ...prevChecked,
      [key]: !prevChecked[key],
    }));
  };

  if (!reservation) {
    return <div>Loading...</div>;
  }

  const totalCheckboxes =
    (reservation.codeUIR ? 1 : 0) +
    (reservation.codeUIRList ? reservation.codeUIRList.length : 0);
  const checkedCount = Object.values(checkedBoxes).filter(Boolean).length;
  const allChecked = checkedCount === totalCheckboxes;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold">Sports</h4>
        <button
          onClick={() => navigate("/ListReservation")}
          className="px-4 py-2 bg-blue-950 text-white rounded-md"
        >
          OK
        </button>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Checklist</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-600">Date:</span>
          <span className="text-gray-800">{reservation.onlyDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-600">Time Start:</span>
          <span className="text-gray-800">{reservation.hourStart}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-600">Time End:</span>
          <span className="text-gray-800">{reservation.hourEnd}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-600">Sport:</span>
          <span className="text-gray-800">
            {sportNames[reservation.sportId] || "Loading..."}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">List of Players:</h3>
          <div className="space-y-2">
            {reservation.codeUIR && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={checkedBoxes["singleCode"] || false}
                  onChange={() => handleCheckboxChange("singleCode")}
                  className="form-checkbox"
                />
                <label className="text-gray-800">{reservation.codeUIR}</label>
              </div>
            )}

            {reservation.codeUIRList && reservation.codeUIRList.length > 0
              ? reservation.codeUIRList.map((code, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checkedBoxes[index] || false}
                      onChange={() => handleCheckboxChange(index)}
                      className="form-checkbox"
                    />
                    <label className="text-gray-800">{code}</label>
                  </div>
                ))
              : "No players listed."}
            <div className="flex items-center space-x-2 mt-4">
              {allChecked ? (
                <span className="text-green-600 font-semibold">
                  ✅ All players checked
                </span>
              ) : (
                <span className="text-red-600 font-semibold">
                  ❌ {checkedCount}/{totalCheckboxes} players checked
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checklist;

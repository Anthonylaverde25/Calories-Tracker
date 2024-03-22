import { Dispatch, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { categories } from "../data/categories";
import { Activity } from "../types";
import { ActivityActions, ActivityState } from "../reducers/activity-reducer";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState;
};

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: "",
  calories: 0,
};

export default function Form({ dispatch, state }: FormProps) {
  const [activity, setActivity] = useState<Activity>(initialState);

  useEffect(() => {
    if (state.activeId) {
      const selectedActivityId = state.activities.filter(
        (stateActivity) => stateActivity.id === state.activeId
      )[0];

      setActivity(selectedActivityId);
    }
  }, [state.activeId]);

  const handlerChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const isNumberField = ["category", "calories"].includes(e.target.id);

    setActivity({
      ...activity,
      [e.target.id]: isNumberField ? +e.target.value : e.target.value,
    });
  };

  const isValidActivity = () => {
    const { name, calories } = activity;
    return name.trim() !== "" && calories > 0;
  };

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "save-activity", payload: { newActivity: activity } });
    setActivity({ ...initialState, id: uuidv4() });
  };

  return (
    <form
      className="space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={handlerSubmit}
    >
      <div className="grid grid-cols-1 gap-3">
        <label className=" font-bold" htmlFor="category">
          Categoria:
        </label>
        <select
          className="border border-slate-300 p-2 rounded-lg w-full bg-shite"
          id="category"
          value={activity.category}
          onChange={handlerChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className=" grid grid-cols-1 gap-3">
        <label className=" font-bold" htmlFor="name">
          Actividad:
        </label>
        <input
          id="name"
          type="text"
          className="border border-slate-300 p-2 rounded-lg w-full bg-shite"
          placeholder="Ej. Comida, jugo de naranja, ejecercicio"
          value={activity.name}
          onChange={handlerChange}
        />
      </div>

      <div className=" grid grid-cols-1 gap-3">
        <label className=" font-bold" htmlFor="calories">
          Calorias:
        </label>
        <input
          id="calories"
          type="number"
          className="border border-slate-300 p-2 rounded-lg w-full bg-shite"
          placeholder="Calorias: 300"
          value={activity.calories}
          onChange={handlerChange}
        />
      </div>

      <input
        type="submit"
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white disabled:opacity-10"
        value={activity.category === 1 ? "Guardar Comida" : "Guardar Ejercicio"}
        disabled={!isValidActivity()}
      />
    </form>
  );
}

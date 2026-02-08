"use client";

import { Tabs } from "nextra/components";
import fracty from "fracty";
import { roundToNearestFive } from "../utils/rounding";

interface Ingredient {
  name: string;
  quantity: number;
  notes?: string;
  unit?: string;
}

interface DrinkIngredientsTableProps {
  ingredients: Ingredient[];
  baseUnit: "oz" | "ml" | "parts" | "cups";
  excludedUnits?: string[];
}

const conversionMatrix: Record<
  string,
  Record<string, (x: number) => number>
> = {
  oz: {
    parts: (x: number) => x / 1.5,
    ml: (x: number) => x * 29.5735,
    cups: (x: number) => x / 8,
  },
  ml: {
    parts: (x: number) => x / 44.3603,
    oz: (x: number) => x / 29.5735,
    cups: (x: number) => x / 236.588,
  },
  parts: {
    oz: (x: number) => x * 1.5,
    ml: (x: number) => x * 44.3603,
    cups: (x: number) => x / 5.333,
  },
  cups: {
    parts: (x: number) => x * 5.333,
    oz: (x: number) => x * 8,
    ml: (x: number) => x * 236.588,
  },
};

const DrinkIngredientsTable: React.FC<DrinkIngredientsTableProps> = ({
  ingredients,
  baseUnit,
  excludedUnits = [],
}: DrinkIngredientsTableProps) => {
  const units = ["ml", "oz", "parts", "cups"].filter(
    (unit) => !excludedUnits.includes(unit)
  );

  return (
    <Tabs items={units} defaultIndex={units.indexOf(baseUnit)}>
      {units.map((unit) => (
        <Tabs.Tab key={unit}>
          <table className="block overflow-x-scroll mt-6 p-0 first:mt-0">
            <thead>
              <tr className="m-0 border-t border-gray-300 p-0 dark:border-gray-600 even:bg-gray-100 even:dark:bg-gray-600/20">
                <th
                  className="m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600"
                  align="left"
                >
                  Ingredient
                </th>
                <th
                  className="m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600"
                  align="center"
                >
                  Quantity
                </th>
                <th
                  className="m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600"
                  align="center"
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map(
                ({ name, quantity, notes, unit: customUnit }) => {
                  const value = customUnit
                    ? quantity
                    : conversionMatrix[baseUnit]?.[unit]
                    ? conversionMatrix[baseUnit][unit](quantity)
                    : quantity;
                  return (
                    <tr
                      className="m-0 border-t border-gray-300 p-0 dark:border-gray-600 even:bg-gray-100 even:dark:bg-gray-600/20"
                      key={name}
                    >
                      <td
                        className="m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600"
                        align="left"
                      >
                        {name}
                      </td>
                      <td
                        className="m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600"
                        align="center"
                      >
                        {unit !== "ml" && !customUnit && fracty(value)}
                        {unit === "ml" &&
                          !customUnit &&
                          roundToNearestFive(value)}{" "}
                        {customUnit ? `${quantity} ${customUnit}` : unit}
                      </td>
                      <td
                        className="m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600"
                        align="center"
                      >
                        {notes}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

export default DrinkIngredientsTable;

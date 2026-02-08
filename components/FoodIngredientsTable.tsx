"use client";

import { Tabs } from "nextra/components";
import {
  roundToNearestFive,
  roundToNearestQuarter,
  roundToNearestTen,
} from "../utils/rounding";

type Unit = "g" | "ml" | "lbs" | "cups" | "tbsp" | "tsp";

interface Ingredient {
  name: string;
  quantity: number;
  notes?: string;
  unit?: Unit | string;
}

const metricToImperial: Record<Unit, Unit> = {
  g: "lbs",
  ml: "cups",
  lbs: "g",
  cups: "ml",
  tbsp: "ml",
  tsp: "ml",
};

const isMetric = (unit: Unit | string): unit is "g" | "ml" =>
  unit === "g" || unit === "ml";
const isImperial = (
  unit: Unit | string
): unit is "lbs" | "cups" | "tbsp" | "tsp" =>
  unit === "lbs" || unit === "cups" || unit === "tbsp" || unit === "tsp";

const conversionMatrix: Record<
  string,
  Record<string, (x: number) => number>
> = {
  g: { lbs: (x: number) => roundToNearestQuarter(x / 453.592) },
  ml: {
    cups: (x: number) => x / 236.588,
    tbsp: (x: number) => x / 14.787,
    tsp: (x: number) => x / 4.929,
  },
  lbs: { g: (x: number) => roundToNearestFive(x * 453.592) },
  cups: {
    ml: (x: number) => roundToNearestTen(x * 236.588),
    tbsp: (x: number) => x * 16,
    tsp: (x: number) => x * 48,
  },
  tbsp: {
    ml: (x: number) => roundToNearestTen(x * 14.787),
    cups: (x: number) => x / 16,
    tsp: (x: number) => x * 3,
  },
  tsp: {
    ml: (x: number) => roundToNearestTen(x * 4.929),
    cups: (x: number) => x / 48,
    tbsp: (x: number) => x / 3,
  },
};

const convertUnits = (value: number, fromUnit: Unit, toUnit: Unit): number => {
  if (fromUnit === toUnit) return value;

  const conversionFunc = conversionMatrix[fromUnit]?.[toUnit];
  if (conversionFunc) return conversionFunc(value);

  // If direct conversion is not available, convert through an intermediate unit
  const intermediateUnit = Object.keys(conversionMatrix[fromUnit])[0] as Unit;
  const valueInIntermediateUnit =
    conversionMatrix[fromUnit][intermediateUnit](value);

  return conversionMatrix[intermediateUnit][toUnit](valueInIntermediateUnit);
};

const getImperialVolumeUnit = (quantityInMl: number): Unit => {
  const quantityInTsp = convertUnits(quantityInMl, "ml", "tsp");

  if (quantityInTsp < 3) {
    return "tsp";
  } else if (quantityInTsp < 12) {
    return "tbsp";
  } else {
    return "cups";
  }
};

const convertIngredientUnits = (
  ingredients: Ingredient[],
  toMetric: boolean
): Ingredient[] => {
  return ingredients.map((ingredient) => {
    const { quantity, unit } = ingredient;

    if (!unit || !(isMetric(unit) || isImperial(unit))) {
      return ingredient;
    }

    if (toMetric && isMetric(unit)) return ingredient;
    if (!toMetric && isImperial(unit)) return ingredient;

    const targetUnit = toMetric
      ? metricToImperial[unit]
      : unit === "ml"
      ? getImperialVolumeUnit(quantity)
      : metricToImperial[metricToImperial[unit]];
    const convertedQuantity = convertUnits(quantity, unit, targetUnit);

    return {
      ...ingredient,
      quantity: convertedQuantity,
      unit: targetUnit,
    };
  });
};

interface FoodIngredientsTableProps {
  ingredients: Ingredient[];
  baseUnit: string;
}

const FoodIngredientsTable: React.FC<FoodIngredientsTableProps> = ({
  ingredients,
  baseUnit,
}: FoodIngredientsTableProps) => {
  const units = ["imperial", "metric"];
  return (
    <Tabs items={units} defaultIndex={units.indexOf(baseUnit)}>
      {units.map((unit) => {
        const convertedIngredients = convertIngredientUnits(
          ingredients,
          unit === "metric"
        );
        return (
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
                {convertedIngredients.map(
                  ({ name, quantity, notes, unit: customUnit }) => {
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
                          {customUnit
                            ? `${quantity} ${customUnit}`
                            : `${quantity} ${unit}`}
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
        );
      })}
    </Tabs>
  );
};

export default FoodIngredientsTable;

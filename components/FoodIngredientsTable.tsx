import { Tabs, Tab } from "nextra-theme-docs";
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

const getImperialVolumeUnit = (quantityInMl: number): Unit => {
  const quantityInTsp = convertUnits(quantityInMl, "ml", "tsp");

  if (quantityInTsp < 3) {
    return "tsp";
  } else if (quantityInTsp < 12) {
    // 12 tsp = 1/4 cup
    return "tbsp";
  } else {
    return "cups";
  }
};

interface FoodIngredientsTableProps {
  ingredients: Ingredient[];
  baseUnit: Unit;
}

const conversionMatrix = {
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

  const conversionFunc = conversionMatrix[fromUnit][toUnit];
  if (conversionFunc) return conversionFunc(value);

  // If direct conversion is not available, convert through an intermediate unit
  const intermediateUnit = Object.keys(conversionMatrix[fromUnit])[0] as Unit;
  const valueInIntermediateUnit =
    conversionMatrix[fromUnit][intermediateUnit](value);

  return conversionMatrix[intermediateUnit][toUnit](valueInIntermediateUnit);
};

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
          <Tab key={unit}>
            <table className="nx-block nx-overflow-x-scroll nextra-scrollbar nx-mt-6 nx-p-0 first:nx-mt-0">
              <thead>
                <tr className="nx-m-0 nx-border-t nx-border-gray-300 nx-p-0 dark:nx-border-gray-600 even:nx-bg-gray-100 even:dark:nx-bg-gray-600/20">
                  <th
                    className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
                    align="left"
                  >
                    Ingredient
                  </th>
                  <th
                    className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
                    align="center"
                  >
                    Quantity
                  </th>
                  <th
                    className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
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
                        className="nx-m-0 nx-border-t nx-border-gray-300 nx-p-0 dark:nx-border-gray-600 even:nx-bg-gray-100 even:dark:nx-bg-gray-600/20"
                        key={name}
                      >
                        <td
                          className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
                          align="left"
                        >
                          {name}
                        </td>
                        <td
                          className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
                          align="center"
                        >
                          {customUnit
                            ? `${quantity} ${customUnit}`
                            : `${quantity} ${unit}`}
                        </td>
                        <td
                          className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
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
          </Tab>
        );
      })}
    </Tabs>
  );
};

export default FoodIngredientsTable;

import { Tabs, Tab } from "nextra-theme-docs";
import fracty from "fracty";

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

const conversionMatrix = {
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
        <Tab key={unit}>
          {baseUnit !== "ml" && unit === "ml" && (
            <small>Recommended to round to nearest 5ml.</small>
          )}
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
              {ingredients.map(
                ({ name, quantity, notes, unit: customUnit }) => {
                  const value = customUnit
                    ? quantity
                    : conversionMatrix[baseUnit]?.[unit]
                    ? conversionMatrix[baseUnit][unit](quantity)
                    : quantity;
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
                        {unit !== "ml" && !customUnit && fracty(value)}
                        {unit === "ml" && !customUnit && Math.round(value)}{" "}
                        {customUnit ? `${quantity} ${customUnit}` : unit}
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
      ))}
    </Tabs>
  );
};

export default DrinkIngredientsTable;

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type MonthSelectProps = {
  month: number;
  year: number;
};

const getMonthYearString = ({ year, month }: MonthSelectProps) =>
  new Date(year, month - 1).toLocaleString("de", {
    month: "long",
    year: "numeric",
  });

const getPreviousMonthYear = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  } else {
    return { year, month: month - 1 };
  }
};

const getNextMonthYear = ({ year, month }: { year: number; month: number }) => {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  } else {
    return { year, month: month + 1 };
  }
};

export default function MonthSelect({ month, year }: MonthSelectProps) {
  const inputMonthYear = { year, month };

  const currentDate = new Date();

  const currentMonthYear = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  };

  const isActiveMonth =
    currentMonthYear.year === inputMonthYear.year &&
    currentMonthYear.month === inputMonthYear.month;

  const nextMonthYear = getNextMonthYear(inputMonthYear);
  const previousMonthYear = getPreviousMonthYear(inputMonthYear);

  const nextMonthYearString = getMonthYearString(nextMonthYear);
  const previousMonthYearString = getMonthYearString(previousMonthYear);

  return (
    <div className="flex justify-between items-center p-3">
      <Button asChild variant="link">
        <Link
          href={`/scoreboard/${previousMonthYear.year}/${previousMonthYear.month}`}
        >
          <ChevronLeft />
          {previousMonthYearString}
        </Link>
      </Button>
      <h2 className="text-2xl">
        für {getMonthYearString({ year, month })}
        {isActiveMonth && (
          <span className="text-sm p-3 italic">(aktiver Monat)</span>
        )}
      </h2>
      <div>
        {!isActiveMonth && (
          <Button asChild variant="link">
            <Link
              href={`/scoreboard/${nextMonthYear.year}/${nextMonthYear.month}`}
            >
              <ChevronRight />
              {nextMonthYearString}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

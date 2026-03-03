'use client'
import { useState } from "react";
import style from "./CharacterUI.module.scss";

interface CharacterItem {
  label: string;
  value: string;
}

interface CharacterUIProps {
  items: CharacterItem[];
  initialView?: number;
  extraClass?:string
}

function CharacterUI({ items, initialView = 5, extraClass }: CharacterUIProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? items : items.slice(0, initialView);
  const hasMore = items.length > initialView;

  return (
    <div className={`${style.wrapper} ${extraClass}`}>
      <ul className={style.list}>
        {visible.map((item, i) => (
          <li key={i} className={style.item}>
            <span className={style.label}>{item.label}</span>
            <span className={style.value}>{item.value}</span>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          className={`${style.toggle} ${showAll ? style.toggle_open : ""}`}
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Показать меньше" : "Показать больше"}
          <svg
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.071 7.071L12.728 1.414L11.314 -1.57345e-06L6.364 4.95L1.414 -1.96646e-07L1.96646e-07 1.414L5.657 7.071C5.84453 7.25847 6.09884 7.36379 6.364 7.36379C6.62916 7.36379 6.88347 7.25847 7.071 7.071Z"
              fill="#072761"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default CharacterUI;
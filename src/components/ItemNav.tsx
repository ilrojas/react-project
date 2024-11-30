import { useState } from "react";
import { Link } from "react-router-dom";

interface ItemNavProps {
  title: string;
  path: string;
  classItem: string;
  reactIcon: React.ElementType;
}

export const ItemNav: React.FC<ItemNavProps> = ({
  title,
  path,
  classItem = "itemsLinks",
  reactIcon: Icon,
}) => {
  return (
    <>
      <li>
        <Link className={classItem} to={path}>
          <Icon />
          <span>{title}</span>
        </Link>
      </li>
    </>
  );
};

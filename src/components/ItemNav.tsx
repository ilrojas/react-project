import React from 'react';
import { Link } from "react-router-dom"

interface ItemNavProps{
    title:string;
    path:string;
    reactIcon:React.ElementType 
}

export const ItemNav: React.FC<ItemNavProps> = ({title,path,reactIcon:Icon}) => {
  return (
    <>
        <li>
			<Link className='itemsLinks' to={path}>
			<Icon/>
			<span>{title}</span>
			</Link>					
		</li>
    </>
  )
}

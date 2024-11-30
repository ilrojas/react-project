import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ListFunctions } from "./components/ListFunctions";
import { UserCard } from "./components/UserCard";
import { Home } from "./components/Home";
import { TodoApp } from "./components/TodoApp";
import { Weather } from "./components/Weather";
import { Movies } from "./components/Movies";
import {
  PiFilmReelDuotone,
  PiCloudMoon,
  PiAppWindowThin,
  PiHouseSimpleThin,
  PiIdentificationBadgeThin,
  PiListBulletsThin,
  PiUserCheckDuotone,
  PiSortDescendingLight,
  PiArrowRightBold,
  PiArrowLeftBold,
} from "react-icons/pi";
import { ItemNav } from "./components/ItemNav";

function App() {
  // Seleccionar todos los <li>
  const listItems = document.querySelectorAll("li");

  // Recorrer los <li> y buscar los <Link> dentro de ellos
  listItems.forEach((li) => {
    const link = li.querySelector("a"); // Reemplaza 'a' por 'Link' si usas React

    if (link) {
      link.addEventListener("click", () => {
        // Quitar la clase 'active' de todos los <Link>
        document
          .querySelectorAll("li a")
          .forEach((el) => el.classList.remove("active"));

        // Agregar la clase 'active' al <Link> clickeado
        link.classList.add("active");
      });
    }
  });

  return (
    <BrowserRouter>
      <header>
        <div className="iconMe">
          <PiUserCheckDuotone />
        </div>
        <nav className="nav">
          <ul>
            <ItemNav
              title="HOME"
              path="/"
              classItem="itemsLinks active"
              reactIcon={PiHouseSimpleThin}
            />
            <ItemNav
              title="TABLE LIST"
              path="/table-list"
              reactIcon={PiListBulletsThin}
            />
            <ItemNav
              title="TODO APP"
              path="/todo-app"
              reactIcon={PiAppWindowThin}
            />
            <ItemNav
              title="USER CARD"
              path="/user-card"
              reactIcon={PiIdentificationBadgeThin}
            />
            <ItemNav title="WEATHER" path="/weather" reactIcon={PiCloudMoon} />
            <ItemNav
              title="MOVIES"
              path="/movies"
              reactIcon={PiFilmReelDuotone}
            />
          </ul>
        </nav>
      </header>
      <main className="content">
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/table-list" element={<ListFunctions />} />
            <Route path="/todo-app" element={<TodoApp />} />
            <Route path="/user-card" element={<UserCard />} />
            <Route path="/weather" element={<Weather />} />
            <Route
              path="/movies"
              element={
                <Movies
                  iconLeft={PiArrowLeftBold}
                  iconRight={PiArrowRightBold}
                />
              }
            />
          </Routes>
        </div>
      </main>

      <footer>
        <p className="read-the-docs">All content is only of learning purpose</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;

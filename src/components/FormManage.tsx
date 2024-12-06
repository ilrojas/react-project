import { useState } from "react";
import { FormData } from "../types";

export const FormManage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    user: "",
    psw: "",
  });
  const [error, setError] = useState("");

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    /* const formData = Object.fromEntries(new window.FormData(event.target))
        console.log(formData)
        if(formData.firstName === ""){
            setError('First name required')
            console.log(error)
        } */
  }

  return (
    <div className="formData ">
      <form onSubmit={handleSubmit}>
        <div className="inputForm">
          <input
            required
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder=" " 
          ></input>
          <label className="form_label" htmlFor="firstName">
            First Name
          </label>
        </div>
        <div className="inputForm">
          <input
            required
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder=" "
          ></input>
          <label className="form_label" htmlFor="lastName">
            Last Name
          </label>
        </div>
        <div className="inputForm">
          <input
            required
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleInputChange}
            placeholder=" "
          ></input>
          <label className="form_label" htmlFor="email">
            Email
          </label>
        </div>
        <div className="inputForm">
          <input
            required
            id="user"
            name="user"
            type="text"
            value={formData.user}
            onChange={handleInputChange}
            placeholder=" "
          ></input>
          <label className="form_label" htmlFor="user">
            Username
          </label>
        </div>
        <div className="inputForm">
          <input
            required
            id="psw"
            name="psw"
            type="password"
            value={formData.psw}
            onChange={handleInputChange}
            placeholder=" "
          ></input>
          <label className="form_label" htmlFor="psw">
            Password
          </label>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};
